import { createRoutesFromFolders } from '@remix-run/v1-route-convention'
import * as fs from 'fs'
import * as path from 'path'
import { getRouteSegments } from './index'
import { defineRoutes } from './routes'

export type RoutingConvention = 'flat-files' | 'flat-folders'
export type MigrateOptions = {
  convention: RoutingConvention
}

const pathSepRegex = new RegExp(`\\${path.sep}`, 'g')
const routeExtensions = ['.js', '.jsx', '.ts', '.tsx', '.md', '.mdx']

export function migrate(
  sourceDir: string,
  targetDir: string,
  options: MigrateOptions = { convention: 'flat-files' },
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

  Object.entries(routes).forEach(([id, route]) => {
    let { path: routePath, file, parentId } = route
    let extension = path.extname(file)

    let flat = convertToRoute(id, parentId!, routePath!, !!route.index)

    // replace sourceDir with targetDir
    if (file.startsWith(sourceDir)) {
      flat = path.join(targetDir, flat.substring(sourceDir.length + 1))
    }

    console.log(`📝 ${id}`)
    if (options.convention === 'flat-folders') {
      if (!routeExtensions.includes(extension)) {
        return
      }
      fs.mkdirSync(flat, { recursive: true })
      fs.cpSync(file, path.join(flat, `/route${extension}`), {
        force: true,
      })
    } else if (options.convention === 'flat-files') {
      const targetFile = `${flat}${extension}`
      fs.cpSync(file, targetFile, { force: true })
    }
  })
  console.log('🏁 Finished!')
}

export function convertToRoute(
  id: string,
  parentId: string,
  routePath: string,
  index: boolean,
) {
  if (parentId && parentId !== 'root') {
    if (routePath?.includes('/')) {
      // multi-segment route, so need to fixup parent for flat-routes (trailing _)
      // strip parent route from route
      let currentPath = id.substring(parentId.length + 1)
      const [first, ...rest] = getRouteSegments(currentPath, index ?? false)
      // rewrite id to use trailing _ for parent
      id = `${parentId}/${first}_/${rest.join('/')}`
    }
  }

  // convert to flat route convention
  let flat = id
    // convert path separators to dots
    .replace(pathSepRegex, '.')
    // convert single _ to [_] due to conflict with new pathless layout prefix
    .replace(/\._([^_.])/g, '.[_]$1')
    // convert double __ to single _ for pathless layout prefix
    .replace(/\.__/g, '._')
    // convert index to _index for index routes
    .replace(/(^|\.)index$/, '$1_index')
  // replace sourceDir with targetDir

  return flat
}
