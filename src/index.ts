import type {
  DefineRouteFunction,
  RouteManifest,
} from '@remix-run/dev/config/routes'
import * as fs from 'fs'
import minimatch from 'minimatch'
import * as path from 'path'

type RouteInfo = {
  id: string
  path: string
  file: string
  name: string
  segments: string[]
  parentId?: string // first pass parent is undefined
  index?: boolean
  caseSensitive?: boolean
}

type DefineRouteOptions = {
  caseSensitive?: boolean
  index?: boolean
}

type DefineRouteChildren = {
  (): void
}

export type VisitFilesFunction = (
  dir: string,
  visitor: (file: string) => void,
  baseDir?: string,
) => void

export type FlatRoutesOptions = {
  appDir?: string
  routeDir?: string | string[]
  defineRoutes?: DefineRoutesFunction
  basePath?: string
  visitFiles?: VisitFilesFunction
  paramPrefixChar?: string
  ignoredRouteFiles?: string[]
  routeRegex?: RegExp
  enableUniqueIdCheck?: boolean
}

export type DefineRoutesFunction = (
  callback: (route: DefineRouteFunction) => void,
) => any

export type {
  DefineRouteFunction,
  DefineRouteOptions,
  DefineRouteChildren,
  RouteManifest,
  RouteInfo,
}
export { flatRoutes }

const defaultOptions: FlatRoutesOptions = {
  appDir: 'app',
  routeDir: 'routes',
  basePath: '/',
  paramPrefixChar: '$',
  routeRegex:
    /(([+]\/[a-zA-Z0-9_$.\[\]-]+)|\/((index|route|layout|page)|(_[a-zA-Z0-9_$.-]+)|([a-zA-Z0-9_$.\[\]-]+\.route)))\.(ts|tsx|js|jsx|md|mdx)$/,
  enableUniqueIdCheck: true,
}
const defaultDefineRoutes = undefined

export default function flatRoutes(
  routeDir: string | string[],
  defineRoutes: DefineRoutesFunction,
  options: FlatRoutesOptions = {},
): RouteManifest {
  const routes = _flatRoutes(
    options.appDir ?? defaultOptions.appDir!,
    options.ignoredRouteFiles ?? [],
    {
      ...defaultOptions,
      ...options,
      routeDir,
      defineRoutes,
    },
  )
  // update undefined parentIds to 'root'
  Object.values(routes).forEach(route => {
    if (route.parentId === undefined) {
      route.parentId = 'root'
    }
  })

  // HACK: Update the route ids for index routes to work around
  // a bug in Remix as of v1.7.5. Need this until PR #4560 is merged.
  // https://github.com/remix-run/remix/pull/4560
  let fixedRoutes = fixupIndexRoutes(routes)
  return fixedRoutes
}

function fixupIndexRoutes(routes: any) {
  let oldRoutes = { ...routes }
  // append /index to all index route ids
  Object.entries(oldRoutes).forEach(([id, route]: any) => {
    if (route.index && !id.endsWith('/index')) {
      let newId = id + '/index'
      route.id = newId
      routes[newId] = route
      delete routes[id]
    }
  })
  // fixup the parent ids to match the new ids
  Object.entries(routes).forEach(([, route]: any) => {
    if (routes[route.parentId!]?.index) {
      route.parentId = routes[routes.parentId!].id
    }
  })
  return routes
}

// this function uses the same signature as the one used in core remix
// this way we can continue to enhance this package and still maintain
// compatibility with remix
function _flatRoutes(
  appDir: string,
  ignoredFilePatternsOrOptions?: string[] | FlatRoutesOptions,
  options?: FlatRoutesOptions,
): RouteManifest {
  // get options
  let ignoredFilePatterns: string[] = []
  if (
    ignoredFilePatternsOrOptions &&
    !Array.isArray(ignoredFilePatternsOrOptions)
  ) {
    options = ignoredFilePatternsOrOptions
  } else {
    ignoredFilePatterns = ignoredFilePatternsOrOptions ?? []
  }
  if (!options) {
    options = defaultOptions
  }

  let routeMap: Map<string, RouteInfo> = new Map()
  let nameMap: Map<string, RouteInfo> = new Map()

  let routeDirs = Array.isArray(options.routeDir)
    ? options.routeDir
    : [options.routeDir ?? 'routes']
  let defineRoutes = options.defineRoutes ?? defaultDefineRoutes
  if (!defineRoutes) {
    throw new Error('You must provide a defineRoutes function')
  }
  let visitFiles = options.visitFiles ?? defaultVisitFiles
  let routeRegex = options.routeRegex ?? defaultOptions.routeRegex!

  for (let routeDir of routeDirs) {
    visitFiles(path.join(appDir, routeDir), file => {
      if (
        ignoredFilePatterns &&
        ignoredFilePatterns.some(pattern =>
          minimatch(file, pattern, { dot: true }),
        )
      ) {
        return
      }

      if (isRouteModuleFile(file, routeRegex)) {
        let routeInfo = getRouteInfo(routeDir, file, options!)
        routeMap.set(routeInfo.id, routeInfo)
        nameMap.set(routeInfo.name, routeInfo)
        return
      }
    })
  }
  // update parentIds for all routes
  Array.from(routeMap.values()).forEach(routeInfo => {
    let parentId = findParentRouteId(routeInfo, nameMap)
    routeInfo.parentId = parentId
  })
  let uniqueRoutes = new Map<string, string>()

  // Then, recurse through all routes using the public defineRoutes() API
  function defineNestedRoutes(
    defineRoute: DefineRouteFunction,
    parentId?: string,
  ): void {
    let childRoutes = Array.from(routeMap.values()).filter(
      routeInfo => routeInfo.parentId === parentId,
    )
    let parentRoute = parentId ? routeMap.get(parentId) : undefined
    let parentRoutePath = parentRoute?.path ?? '/'
    for (let childRoute of childRoutes) {
      let routePath = childRoute?.path?.slice(parentRoutePath.length) ?? ''
      // remove leading slash
      if (routePath.startsWith('/')) {
        routePath = routePath.slice(1)
      }
      let index = childRoute.index
      let fullPath = childRoute.path

      // add option to check for unique route ids
      // this is copied from remix default convention
      // but it is currently breaking some flat routes
      // so until we can figure out a better way to do this
      // make it optional to unblock users
      if (options?.enableUniqueIdCheck) {
        let uniqueRouteId = (fullPath || '') + (index ? '?index' : '')

        if (uniqueRouteId) {
          if (uniqueRoutes.has(uniqueRouteId)) {
            throw new Error(
              `Path ${JSON.stringify(
                fullPath,
              )} defined by route ${JSON.stringify(
                childRoute.id,
              )} conflicts with route ${JSON.stringify(
                uniqueRoutes.get(uniqueRouteId),
              )}`,
            )
          } else {
            uniqueRoutes.set(uniqueRouteId, childRoute.id)
          }
        }
      }
      if (index) {
        let invalidChildRoutes = Object.values(routeMap).filter(
          routeInfo => routeInfo.parentId === childRoute.id,
        )

        if (invalidChildRoutes.length > 0) {
          throw new Error(
            `Child routes are not allowed in index routes. Please remove child routes of ${childRoute.id}`,
          )
        }

        defineRoute(routePath, routeMap.get(childRoute.id!)!.file, {
          index: true,
        })
      } else {
        defineRoute(routePath, routeMap.get(childRoute.id!)!.file, () => {
          defineNestedRoutes(defineRoute, childRoute.id)
        })
      }
    }
  }
  let routes = defineRoutes(defineNestedRoutes)
  return routes
}

const routeModuleExts = ['.js', '.jsx', '.ts', '.tsx', '.md', '.mdx']
const serverRegex = /\.server\.(ts|tsx|js|jsx|md|mdx)$/
const indexRouteRegex =
  /((^|[.]|[+]\/)(index|_index))(\/[^\/]+)?$|(\/_?index\/)/

export function isRouteModuleFile(
  filename: string,
  routeRegex: RegExp,
): boolean {
  // flat files only need correct extension
  let isFlatFile = !filename.includes(path.sep)
  if (isFlatFile) {
    return routeModuleExts.includes(path.extname(filename))
  }
  let isRoute = routeRegex.test(filename)
  if (isRoute) {
    // check to see if it ends in .server.tsx because you may have
    // a _route.tsx and and _route.server.tsx and only the _route.tsx
    // file should be considered a route
    let isServer = serverRegex.test(filename)
    return !isServer
  }
  return false
}

export function isIndexRoute(routeId: string): boolean {
  return indexRouteRegex.test(routeId)
}

export function getRouteInfo(
  routeDir: string,
  file: string,
  options: FlatRoutesOptions,
) {
  let filePath = path.join(routeDir, file)
  let routeId = createRouteId(filePath)
  let routeIdWithoutRoutes = routeId.slice(routeDir.length + 1)
  let index = isIndexRoute(routeIdWithoutRoutes)
  let routeSegments = getRouteSegments(
    routeIdWithoutRoutes,
    index,
    options.paramPrefixChar,
  )
  let routePath = createRoutePath(routeSegments, index, options)
  let routeInfo = {
    id: routeId,
    path: routePath!,
    file: filePath,
    name: routeSegments.join('/'),
    segments: routeSegments,
    index,
  }

  return routeInfo
}

// create full path starting with /
export function createRoutePath(
  routeSegments: string[],
  index: boolean,
  options: FlatRoutesOptions,
): string | undefined {
  let result = ''
  let basePath = options.basePath ?? '/'
  let paramPrefixChar = options.paramPrefixChar ?? '$'

  if (index) {
    // replace index with blank
    routeSegments[routeSegments.length - 1] = ''
  }
  for (let i = 0; i < routeSegments.length; i++) {
    let segment = routeSegments[i]
    // skip pathless layout segments
    if (segment.startsWith('_')) {
      continue
    }
    // remove trailing slash
    if (segment.endsWith('_')) {
      segment = segment.slice(0, -1)
    }

    // handle param segments: $ => *, $id => :id
    if (segment.startsWith(paramPrefixChar)) {
      if (segment === paramPrefixChar) {
        result += `/*`
      } else {
        result += `/:${segment.slice(1)}`
      }
      // handle optional segments: (segment) => segment?
    } else if (segment.startsWith('(')) {
      result += `/${segment.slice(1, segment.length - 1)}?`
    } else {
      result += `/${segment}`
    }
  }
  if (basePath !== '/') {
    result = basePath + result
  }
  return result || undefined
}

function findParentRouteId(
  routeInfo: RouteInfo,
  nameMap: Map<string, RouteInfo>,
): string | undefined {
  let parentName = routeInfo.segments.slice(0, -1).join('/')
  while (parentName) {
    if (nameMap.has(parentName)) {
      return nameMap.get(parentName)!.id
    }
    parentName = parentName.substring(0, parentName.lastIndexOf('/'))
  }
  return undefined
}

export function getRouteSegments(
  name: string,
  index: boolean,
  paramPrefixChar: string = '$',
) {
  let routeSegments: string[] = []
  let i = 0
  let routeSegment = ''
  let state = 'START'
  let subState = 'NORMAL'
  let hasPlus = false
  // replace +/ with .
  // this supports folders for organizing flat-files convention
  // _public+/about.tsx => _public.about.tsx
  //
  if (/[+][\/\\]/.test(name)) {
    name = name.replace(/[+][\/\\]/g, '.')
    hasPlus = true
  }
  let hasFolder = /[\/\\]/.test(name)
  // if name has plus folder, but we still have regular folders
  // then treat ending route as flat-folders
  if (((hasPlus && hasFolder) || !hasPlus) && !name.endsWith('.route')) {
    // do not remove segments ending in .route
    // since these would be part of the route directory name
    // docs/readme.route.tsx => docs/readme
    // remove last segment since this should just be the
    // route filename and we only want the directory name
    // docs/_layout.tsx => docs
    let last = name.lastIndexOf(path.sep)
    if (last >= 0) {
      name = name.substring(0, last)
    }
  }

  let pushRouteSegment = (routeSegment: string) => {
    if (routeSegment) {
      routeSegments.push(routeSegment)
    }
  }

  while (i < name.length) {
    let char = name[i]
    switch (state) {
      case 'START':
        // process existing segment
        if (
          routeSegment.includes(paramPrefixChar) &&
          !routeSegment.startsWith(paramPrefixChar)
        ) {
          throw new Error(
            `Route params must start with prefix char ${paramPrefixChar}: ${routeSegment}`,
          )
        }
        if (
          routeSegment.includes('(') &&
          !routeSegment.startsWith('(') &&
          !routeSegment.endsWith(')')
        ) {
          throw new Error(
            `Optional routes must start and end with parentheses: ${routeSegment}`,
          )
        }
        pushRouteSegment(routeSegment)
        routeSegment = ''
        state = 'PATH'
        continue // restart without advancing index
      case 'PATH':
        if (isPathSeparator(char) && subState === 'NORMAL') {
          state = 'START'
          break
        } else if (char === '[') {
          subState = 'ESCAPE'
          break
        } else if (char === ']') {
          subState = 'NORMAL'
          break
        }
        routeSegment += char
        break
    }
    i++ // advance to next character
  }
  // process remaining segment
  pushRouteSegment(routeSegment)
  // strip trailing .route segment
  if (routeSegments.at(-1) === 'route') {
    routeSegments = routeSegments.slice(0, -1)
  }
  // if hasPlus, we need to strip the trailing segment if it starts with _
  // and route is not an index route
  // this is to handle layouts in flat-files
  // _public+/_layout.tsx => _public.tsx
  // _public+/index.tsx => _public.index.tsx
  if (!index && hasPlus && routeSegments.at(-1)?.startsWith('_')) {
    routeSegments = routeSegments.slice(0, -1)
  }
  return routeSegments
}

const pathSeparatorRegex = /[\/\\.]/
function isPathSeparator(char: string) {
  return pathSeparatorRegex.test(char)
}

export function defaultVisitFiles(
  dir: string,
  visitor: (file: string) => void,
  baseDir = dir,
) {
  for (let filename of fs.readdirSync(dir)) {
    let file = path.resolve(dir, filename)
    let stat = fs.lstatSync(file)

    if (stat.isDirectory()) {
      defaultVisitFiles(file, visitor, baseDir)
    } else if (stat.isFile()) {
      visitor(path.relative(baseDir, file))
    }
  }
}

export function createRouteId(file: string) {
  return normalizeSlashes(stripFileExtension(file))
}

export function normalizeSlashes(file: string) {
  return file.split(path.win32.sep).join('/')
}

function stripFileExtension(file: string) {
  return file.replace(/\.[a-z0-9]+$/i, '')
}
