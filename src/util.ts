import * as fs from 'fs'
import * as path from 'path'
import type { VisitFilesFunction } from './index'

export function getRouteSegments(name: string) {
  let routeSegments: string[] = []
  let index = 0
  let routeSegment = ''
  let state = 'START'
  let subState = 'NORMAL'

  const pushRouteSegment = (routeSegment: string) => {
    if (routeSegment) {
      routeSegments.push(routeSegment)
    }
  }

  while (index < name.length) {
    let char = name[index]
    switch (state) {
      case 'START':
        // process existing segment
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
    index++ // advance to next character
  }
  // process remaining segment
  pushRouteSegment(routeSegment)

  return routeSegments
}

function isPathSeparator(char: string) {
  return char === '/' || char === path.win32.sep || char === '.'
}

export const visitFiles: VisitFilesFunction = (
  dir: string,
  visitor: (file: string) => void,
  baseDir = dir,
) => {
  for (let filename of fs.readdirSync(dir)) {
    let file = path.resolve(dir, filename)
    let stat = fs.lstatSync(file)

    if (stat.isDirectory()) {
      visitFiles(file, visitor, baseDir)
    } else if (stat.isFile()) {
      visitor(path.relative(baseDir, file))
    }
  }
}
