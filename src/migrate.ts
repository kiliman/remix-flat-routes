import * as fs from 'fs'
import * as path from 'path'
import { visitFiles } from './util'

export type RoutingConvention = 'flat-files' | 'flat-folders'
export type MigrateOptions = {
  convention: RoutingConvention
}
export function migrate(
  sourceDir: string,
  targetDir: string,
  options: MigrateOptions = { convention: 'flat-files' },
) {
  var visitor = options.convention === 'flat-files' ? flatFiles : flatFolders

  visitFiles(sourceDir, visitor(sourceDir, targetDir))
}

export function flatFiles(sourceDir: string, targetDir: string) {
  return (file: string) => {
    console.log(file)
    let extension = path.extname(file)
    let name = file.substring(0, file.length - extension.length)
    const route = convertToRoute(name)
    const targetFile = `${targetDir}/${route}${extension}`
    fs.cpSync(`${sourceDir}/${file}`, targetFile, { force: true })
  }
}

const routeExtensions = ['.js', '.jsx', '.ts', '.tsx', '.mdx']
export function flatFolders(sourceDir: string, targetDir: string) {
  return (file: string) => {
    console.log(file)
    const extension = path.extname(file)
    const name = file.substring(0, file.length - extension.length)
    const route = convertToRoute(name)
    const targetFolder = `${targetDir}/${route}`
    if (!routeExtensions.includes(extension)) {
      return
    }
    fs.mkdirSync(targetFolder, { recursive: true })
    fs.cpSync(`${sourceDir}/${file}`, `${targetFolder}/index${extension}`, {
      force: true,
    })
  }
}

export function convertToRoute(file: string) {
  const pathSegments = file.split('/')
  const parent =
    pathSegments.length == 1 ? '' : pathSegments.slice(0, -1).join('/')
  const route = pathSegments.slice(-1)[0]
  const routeSegments = route.split('.')

  if (routeSegments.length > 1) {
    routeSegments[0] = `${routeSegments[0]}_`
  }

  return `${getFlatRoute(parent.split('/'))}${
    parent === '' ? '' : '.'
  }${getFlatRoute(routeSegments)}`
}

function getFlatRoute(segments: string[]) {
  return segments
    .map(segment => (segment.startsWith('__') ? segment.substring(1) : segment))
    .join('.')
}
