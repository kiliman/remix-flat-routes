import { createRoutesFromFolders } from '@remix-run/v1-route-convention'
import * as fs from 'fs'
import * as path from 'path'
import { type RouteManifest } from './index'
import { defineRoutes } from './routes'

export type RoutingConvention = 'flat-files' | 'flat-folders' | 'hybrid'
export type MigrateOptions = {
  convention: RoutingConvention
  force: boolean
}

const pathSepRegex = new RegExp(`\\${path.sep}`, 'g')
const routeExtensions = ['.js', '.jsx', '.ts', '.tsx', '.md', '.mdx']

export function migrate(
  sourceDir: string,
  targetDir: string,
  options: MigrateOptions = { convention: 'flat-files', force: false },
) {
  if (sourceDir.startsWith('./')) {
    sourceDir = sourceDir.substring(2)
  }
  if (targetDir.startsWith('./')) {
    targetDir = targetDir.substring(2)
  }

  console.log(
    `🛠️ Migrating to flat-routes using ${options.convention} convention...`,
  )
  console.log(`🗂️ source: ${sourceDir}`)
  console.log(`🗂️ target: ${targetDir}`)
  console.log()

  const routes = createRoutesFromFolders(defineRoutes, {
    appDirectory: './',
    routesDirectory: sourceDir,
  })

  console.log(routes)
  Object.entries(routes).forEach(([id, route]) => {
    let { path: routePath, file, parentId } = route
    let extension = path.extname(file)

    let flat = convertToRoute(
      routes,
      sourceDir,
      id,
      parentId!,
      routePath!,
      !!route.index,
      options.convention,
    )

    // replace sourceDir with targetDir
    flat = path.join(targetDir, flat)

    //console.log(`📝 ${id}`)
    if (options.convention === 'flat-folders') {
      if (!routeExtensions.includes(extension)) {
        return
      }
      fs.mkdirSync(flat, { recursive: true })
      fs.cpSync(file, path.join(flat, `/route${extension}`), {
        force: true,
      })
    } else if (options.convention === 'hybrid') {
      if (!routeExtensions.includes(extension)) {
        return
      }
      fs.mkdirSync(path.dirname(flat), { recursive: true })
      const targetFile = `${flat}${extension}`
      fs.cpSync(file, targetFile, { force: true })
    } else if (options.convention === 'flat-files') {
      const targetFile = `${flat}${extension}`
      fs.cpSync(file, targetFile, { force: true })
    }
  })
  console.log('🏁 Finished!')
}

export function convertToRoute(
  routes: RouteManifest,
  sourceDir: string,
  id: string,
  parentId: string,
  routePath: string,
  index: boolean,
  convention: RoutingConvention,
) {
  // strip sourceDir from id and parentId
  let routeId = id.substring(sourceDir.length + 1)
  parentId =
    parentId === 'root' ? parentId : parentId.substring(sourceDir.length + 1)

  if (parentId && parentId !== 'root') {
    if (convention !== 'hybrid' && routePath?.includes('/')) {
      // multi-segment route, so need to fixup parent for flat-routes (trailing _)
      // strip parent route from route
      let currentPath = routeId.substring(parentId.length + 1)
      let routeSegments = getRouteSegments(currentPath)
      let dottedSegments = getEscapedDottedRouteSegments(routeSegments[0])
      console.log({ routeSegments, dottedSegments })
      if (dottedSegments.length > 1) {
        const [first, ...rest] = dottedSegments
        //rewrite id to use trailing _ for parent
        routeId = `${parentId}/${first}_.${rest.join('.')}`
        if (routeSegments.length > 1) {
          routeSegments.shift()
          routeId += `/${routeSegments.join('.')}`
        }
      } else {
        routeId = `${parentId}/${routeSegments.join('.')}`
      }
    }
  }

  if (convention === 'hybrid') {
    let flat = routeId
      // convert path separators /+ hybrid format
      .replace(pathSepRegex, '+/')
      // convert single _ to [_] due to conflict with new pathless layout prefix
      .replace(/(^|\/|\.)_([^_.])/g, '$1[_]$2')
      // convert double __ to single _ for pathless layout prefix
      .replace(/(^|\/|\.)__/g, '$1_')
      // convert index to _index for index routes
      .replace(/(^|\/|\.)index$/, '$1_index')

    // check if route is a parent route
    // is so, move to hybrid folder (+) as _layout route
    if (Object.values(routes).some(r => r.parentId === id)) {
      flat = flat + '+/_layout'
    }

    return flat
  }
  // convert to flat route convention
  let flat = routeId
    // convert path separators to dots
    .replace(pathSepRegex, '.')
    // convert single _ to [_] due to conflict with new pathless layout prefix
    .replace(/(^|\/|\.)_([^_.])/g, '$1[_]$2')
    // convert double __ to single _ for pathless layout prefix
    .replace(/(^|\/|\.)__/g, '$1_')
    // convert index to _index for index routes
    .replace(/(^|\/|\.)index$/, '$1_index')

  return flat
}

function getRouteSegments(routePath: string) {
  return routePath.split('/')
}

function getEscapedDottedRouteSegments(name: string) {
  let routeSegments: string[] = []
  let i = 0
  let routeSegment = ''
  let state = 'START'
  let subState = 'NORMAL'

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
        pushRouteSegment(routeSegment)
        routeSegment = ''
        state = 'PATH'
        continue // restart without advancing index
      case 'PATH':
        if (char === '.' && subState === 'NORMAL') {
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
  return routeSegments
}
