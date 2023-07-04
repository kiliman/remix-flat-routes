import { createRoutesFromFolders } from '@remix-run/v1-route-convention'
import * as fs from 'fs'
import * as path from 'path'
import { getRouteSegments } from './index'
import { defineRoutes } from './routes'

export type RoutingConvention = 'flat-files' | 'flat-folders'
export type MigrateOptions = {
  convention: RoutingConvention
}
export function migrate(
  sourceDir: string,
  targetDir: string,
  options: MigrateOptions = { convention: 'flat-files' },
) {
  // var visitor = options.convention === 'flat-files' ? flatFiles : flatFolders

  // visitFiles(sourceDir, visitor(sourceDir, targetDir))

  const routes = createRoutesFromFolders(defineRoutes, {
    appDirectory: './app',
    routesDirectory: sourceDir,
  })

  Object.entries(routes).forEach(([_key, route]) => {
    let file = route.file
    let flat = file
      .replace(/[\/]/g, '.')
      .replace(/\._([^_.])/g, '.[_]$1')
      .replace(/\.__/g, '._')
      .replace(/\.index.tsx$/, '._index.tsx')
      .replace(/^routes\./, 'routes/')
    console.log(flat)
  })
}

export function flatFiles(sourceDir: string, targetDir: string) {
  return (file: string) => {
    console.log(file)
    let extension = path.extname(file)
    let name = file.substring(0, file.length - extension.length)
    const route = convertToRoute(name)
    const targetFile = path.join(targetDir, `${route}${extension}`)
    fs.cpSync(path.join(sourceDir, file), targetFile, { force: true })
  }
}

const routeExtensions = ['.js', '.jsx', '.ts', '.tsx', '.md', '.mdx']
export function flatFolders(sourceDir: string, targetDir: string) {
  return (file: string) => {
    console.log(file)
    const extension = path.extname(file)
    const name = file.substring(0, file.length - extension.length)
    const route = convertToRoute(name)
    const targetFolder = path.join(targetDir, route)
    if (!routeExtensions.includes(extension)) {
      return
    }
    fs.mkdirSync(targetFolder, { recursive: true })
    fs.cpSync(
      path.join(sourceDir, file),
      path.join(targetFolder, `/_index${extension}`),
      {
        force: true,
      },
    )
  }
}

export function convertToRoute(name: string) {
  const pathSegments = name.split(path.sep)
  return pathSegments
    .map(pathSegment => {
      const index = /(^|[.])index$/.test(pathSegment)
      const routeSegments = getRouteSegments(pathSegment, index)
      return getFlatRoute(routeSegments)
    })
    .join('.')
}

function getFlatRoute(segments: string[]) {
  return segments
    .map(segment =>
      segment.startsWith('__')
        ? segment.substring(1)
        : segment === 'index'
        ? '_index'
        : segment,
    )
    .join('.')
}
