import * as path from 'path'
import { visitFiles } from './util'

type RouteInfo = {
  path: string
  file: string
  name: string
  parent: string
  isIndex: boolean
}

type DefineRouteOptions = {
  caseSensitive?: boolean
  index?: boolean
}

type DefineRouteChildren = {
  (): void
}

type DefineRouteFunction = (
  path: string | undefined,
  file: string,
  optionsOrChildren?: DefineRouteOptions | DefineRouteChildren,
  children?: DefineRouteChildren,
) => void

export type VisitFilesFunction = (
  dir: string,
  visitor: (file: string) => void,
  baseDir?: string,
) => void

type FlatRoutesOptions = {
  basePath?: string
}

type ParentMapEntry = {
  routeInfo: RouteInfo
  children: RouteInfo[]
}

export type DefineRoutesFunction = (
  callback: (route: DefineRouteFunction) => void,
) => any

export default function flatRoutes(
  baseDir: string,
  defineRoutes: DefineRoutesFunction,
  options: FlatRoutesOptions = {},
) {
  const routeMap = new Map<string, RouteInfo>()
  const parentMap = new Map<string, ParentMapEntry>()

  // initialize root route
  routeMap.set('root', {
    path: '',
    file: 'root.tsx',
    name: 'root',
    parent: '',
    isIndex: false,
  })
  var routes = defineRoutes(route => {
    visitFiles(`app/${baseDir}`, routeFile => {
      const routeInfo = getRouteInfo(baseDir, routeFile, options.basePath)
      if (!routeInfo) return
      routeMap.set(routeInfo.name, routeInfo)
    })
    // setup parent map
    for (let [_name, route] of routeMap) {
      let parentRoute = route.parent
      if (parentRoute) {
        let parent = parentMap.get(parentRoute)
        if (!parent) {
          parent = {
            routeInfo: routeMap.get(parentRoute)!,
            children: [],
          }
          parentMap.set(parentRoute, parent)
        }
        parent.children.push(route)
      }
    }
    // start with root
    getRoutes(parentMap, 'root', route)
  })
  // don't return root since remix already provides it
  delete routes.root
  return routes
}

function getRoutes(
  parentMap: Map<string, ParentMapEntry>,
  parent: string,
  route: DefineRouteFunction,
) {
  let parentRoute = parentMap.get(parent)
  if (parentRoute && parentRoute.children) {
    const routeOptions: DefineRouteOptions = {
      caseSensitive: false,
      index: parentRoute!.routeInfo.isIndex,
    }
    const routeChildren: DefineRouteChildren = () => {
      for (let child of parentRoute!.children) {
        getRoutes(parentMap, child.name, route)
        const path = child.path.substring(
          parentRoute!.routeInfo.path.length + 1,
        )
        route(path, child.file, { index: child.isIndex })
      }
    }
    route(
      parentRoute.routeInfo.path,
      parentRoute.routeInfo.file,
      routeOptions,
      routeChildren,
    )
  }
}

export function getRouteInfo(
  baseDir: string,
  routeFile: string,
  basePath?: string,
): RouteInfo | null {
  let state = 'START'
  let subState = 'NORMAL'
  let parentState = 'APPEND'
  let url = basePath ?? ''
  let parent = ''
  let isIndex = false
  // get extension
  let ext = path.extname(routeFile)
  // only process valid route files
  if (!['.js', '.jsx', '.ts', '.tsx'].includes(ext)) {
    return null
  }
  // remove extension from name
  let name = routeFile.substring(0, routeFile.length - ext.length)
  // route module so only process index routes
  if (routeFile.includes('/')) {
    if (
      !name.endsWith('/index') &&
      !name.endsWith('/_layout') &&
      !name.endsWith('/_route')
    ) {
      return null
    }
    name = path.dirname(routeFile)
    isIndex = name.endsWith('/index') || name.endsWith('.index')
  }
  let index = 0
  let pathSegment = ''
  let routeSegment = ''
  while (index < name.length) {
    let char = name[index]
    switch (state) {
      case 'START':
        // process existing segment
        url = appendPathSegment(url, pathSegment)

        if (routeSegment.endsWith('_')) {
          parentState = 'IGNORE'
        }
        if (parentState === 'APPEND') {
          if (parent) {
            parent += '.'
          }
          parent += routeSegment
        }
        if (routeSegment === 'index') isIndex = true
        pathSegment = '' // reset segment
        routeSegment = ''
        state = 'PATH'
        continue // restart without advancing index
      case 'PATH':
        if (isPathSeparator(char) && subState === 'NORMAL') {
          state = 'START'
          break
        } else if (char === '$') {
          pathSegment += ':'
        } else if (char === '[') {
          subState = 'ESCAPE'
        } else if (char === ']') {
          subState = 'NORMAL'
        } else {
          pathSegment += char
        }
        routeSegment += char

        break
    }
    index++ // advance to next character
  }
  if (routeSegment === 'index') isIndex = true
  url = appendPathSegment(url, pathSegment)
  return {
    path: url,
    file: `${baseDir}/${routeFile}`,
    name,
    parent: parent || 'root',
    isIndex,
  }
}

function appendPathSegment(url: string, segment: string) {
  if (segment) {
    if (segment.startsWith('_')) {
      return url
    }
    if (segment === 'index') {
      if (!url.endsWith('/')) {
        url += '/'
      }
    } else if (segment === ':' || segment === ':_') {
      url += '/*'
    } else if (segment !== 'route') {
      // strip trailing underscore
      if (segment.endsWith('_')) {
        segment = segment.slice(0, -1)
      }
      url += '/' + segment
    }
  }
  return url
}

function isPathSeparator(char: string) {
  return char === '/' || char === path.win32.sep || char === '.'
}

export { flatRoutes }
export type {
  DefineRouteFunction,
  DefineRouteOptions,
  DefineRouteChildren,
  RouteInfo,
}
