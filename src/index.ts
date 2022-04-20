import * as fs from 'fs'
import * as path from 'path'

export default function flatRoutes(
  baseDir: string,
  defineRoutes: (route: (...args: any) => void) => any,
) {
  const routeMap = new Map()
  const parentMap = new Map()

  // initialize root route
  routeMap.set('root', {
    path: '',
    file: 'root.tsx',
  })
  var routes = defineRoutes(route => {
    visitFiles(`app/${baseDir}`, routeFile => {
      const parsed = parseRouteFile(baseDir, routeFile)
      if (!parsed) return
      routeMap.set(parsed.name, parsed)
    })
    // setup parent map
    for (let [name, route] of routeMap) {
      let parentRoute = route.parent
      if (parentRoute) {
        let parent = parentMap.get(parentRoute)
        if (!parent) {
          parent = {
            parsed: routeMap.get(parentRoute),
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
  parentMap: Map<string, any>,
  parent: string,
  route: (...args: any) => void,
) {
  let parentRoute = parentMap.get(parent)
  if (parentRoute && parentRoute.children) {
    route(
      parentRoute.parsed.path,
      parentRoute.parsed.file,
      () => {
        for (let child of parentRoute.children) {
          getRoutes(parentMap, child.name, route)
          route(
            child.path.substring(parentRoute.parsed.path.length + 1),
            child.file,
            { index: child.isIndex },
          )
        }
      },
      { index: parentRoute.parsed.isIndex },
    )
  }
}

function parseRouteFile(baseDir: string, routeFile: string) {
  let state = 'START'
  let subState = 'NORMAL'
  let parentState = 'APPEND'
  let url = ''
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
    if (!name.endsWith('/index') && !name.endsWith('/_layout')) {
      return null
    }
    name = path.dirname(routeFile)
    isIndex = name.endsWith('/index') || name.endsWith('.index')
  }
  let index = 0
  let segment = ''
  while (index < name.length) {
    let char = name[index]
    // console.log({ char, state, subState, segment, url })
    switch (state) {
      case 'START':
        // process existing segment
        url = appendSegment(url, segment)

        if (segment.endsWith('_')) {
          parentState = 'IGNORE'
        }
        if (parentState === 'APPEND') {
          if (parent) {
            parent += '.'
          }
          if (segment.includes(':')) {
            segment = segment.replace(':', '$')
          }
          parent += segment
        }
        if (segment === 'index') isIndex = true
        segment = '' // reset segment
        state = 'PATH'
        continue // restart without advancing index
      case 'PATH':
        if (isPathSeparator(char) && subState === 'NORMAL') {
          state = 'START'
        } else if (char === '$') {
          segment += ':'
        } else if (char === '[') {
          subState = 'ESCAPE'
        } else if (char === ']') {
          subState = 'NORMAL'
        } else {
          segment += char
        }
        break
      case 'PATHLESS':
        if (isPathSeparator(char)) {
          state = 'START'
        }
        break
    }
    index++ // advance to next character
  }
  if (segment === 'index') isIndex = true
  url = appendSegment(url, segment)
  return {
    path: url,
    file: `${baseDir}/${routeFile}`,
    name,
    parent: parent || 'root',
    isIndex,
  }
}

function appendSegment(url: string, segment: string) {
  if (segment) {
    if (segment.startsWith('_')) {
      return url
    }
    if (segment === 'index') {
      if (!url.endsWith('/')) {
        url += '/'
      }
    } else if (segment === ':') {
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

function visitFiles(
  dir: string,
  visitor: (file: string) => void,
  baseDir = dir,
) {
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

export { flatRoutes }
