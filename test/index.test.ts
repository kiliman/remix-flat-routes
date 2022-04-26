import type { RouteInfo } from '../src/index'
import { getRouteInfo } from '../src/index'
import { routes as flatFiles } from './flat-files'
import { routes as flatFolders } from './flat-folders'

describe('parse flat-files routes', () => {
  test.each(flatFiles)('%s: %s', (_description, route, expected) => {
    const result = getRouteInfo('routes', route)
    expect(result).toEqual(expected)
  })
})

describe('parse flat-folders routes', () => {
  test.each(flatFolders)('%s: %s', (_description, route, expected) => {
    const result = getRouteInfo('routes', route)
    expect(result).toEqual(expected)
  })
})

describe('parse routes with basePath /myapp', () => {
  test.each(flatFolders)('%s: %s', (_description, route, expected) => {
    const result = getRouteInfo('routes', route, '/myapp')
    expected.path = '/myapp' + expected.path
    expect(result).toEqual(expected)
  })
})

describe('parse nested-flat non-route files', () => {
  // description, route, expected
  const routes: [string, string, RouteInfo | null][] = [
    ['component files', '_auth.forgot-password/component.tsx', null],
    ['server files', '_auth.forgot-password/data.server.ts', null],
    ['image files', '_auth.forgot-password/image.jpg', null],
    ['nested files', '_auth.forgot-password/nested/styles.css', null],
  ]

  test.each(routes)('%s: %s', (_description, route, expected) => {
    const result = getRouteInfo('routes', route)
    expect(result).toEqual(expected)
  })
})
