import { defineRoutes } from '@remix-run/dev/config/routes'
import flatRoutes from '../src/index'

describe('define routes', () => {
  it('should define routes for flat-files', () => {
    const flatFiles = [
      '$lang.$ref.tsx',
      '$lang.$ref._index.tsx',
      '$lang.$ref.$.tsx',
      '_index.tsx',
      'healthcheck.tsx',
    ]
    const routes = flatRoutes('routes', defineRoutes, {
      visitFiles: visitFilesFromArray(flatFiles),
    })
    expect(routes).toMatchSnapshot()
  })
  it('should define routes for flat-folders', () => {
    const flatFolders = [
      '$lang.$ref/_index.tsx',
      '$lang.$ref._index/_index.tsx',
      '$lang.$ref.$/_index.tsx',
      '_index/_index.tsx',
      'healthcheck/_index.tsx',
    ]
    const routes = flatRoutes('routes', defineRoutes, {
      visitFiles: visitFilesFromArray(flatFolders),
    })
    expect(routes).toMatchSnapshot()
  })
  it('should define routes for flat-folders on Windows', () => {
    const flatFolders = [
      '$lang.$ref\\_index.tsx',
      '$lang.$ref._index\\_index.tsx',
      '$lang.$ref.$\\_index.tsx',
      '_index\\_index.tsx',
      'healthcheck\\_index.tsx',
    ]
    const routes = flatRoutes('routes', defineRoutes, {
      visitFiles: visitFilesFromArray(flatFolders),
    })
    expect(routes['routes/$lang.$ref._index/_index'].parentId).toBe(
      'routes/$lang.$ref/_index',
    )
    expect(routes).toMatchSnapshot()
  })
  it('should define routes for complex structure', () => {
    const routeList = [
      '_auth.forgot-password.tsx',
      '_auth.login.tsx',
      '_auth.reset-password.tsx',
      '_auth.signup.tsx',
      '_auth.tsx',
      '_landing.about.tsx',
      '_landing.index.tsx',
      '_landing.tsx',
      'app.calendar.$day.tsx',
      'app.calendar.index.tsx',
      'app.calendar.tsx',
      'app.projects.$id.tsx',
      'app.projects.tsx',
      'app.tsx',
      'app_.projects.$id.roadmap.tsx',
      'app_.projects.$id.roadmap[.pdf].tsx',
    ]
    const routes = flatRoutes('routes', defineRoutes, {
      visitFiles: visitFilesFromArray(routeList),
    })
    expect(routes).toMatchSnapshot()
  })

  it('should ignore non-route files in flat-folders', () => {
    const flatFolders = [
      '$lang.$ref/_layout.tsx',
      '$lang.$ref/component.tsx',
      '$lang.$ref._index/_index.tsx',
      '$lang.$ref._index/style.css',
      '$lang.$ref.$/model.server.ts',
      '_index/_index.tsx',
      'healthcheck/_route.tsx',
    ]
    const routes = flatRoutes('routes', defineRoutes, {
      visitFiles: visitFilesFromArray(flatFolders),
    })
    expect(routes).toMatchSnapshot()
  })
  it('should support markdown routes as flat-files', () => {
    const flatFiles = ['docs.tsx', 'docs.readme.md']
    const routes = flatRoutes('routes', defineRoutes, {
      visitFiles: visitFilesFromArray(flatFiles),
    })
    expect(routes).toMatchSnapshot()
  })
  it('should support markdown routes as flat-folders', () => {
    const flatFolders = ['docs/_layout.tsx', 'docs/readme.route.mdx']
    const routes = flatRoutes('routes', defineRoutes, {
      visitFiles: visitFilesFromArray(flatFolders),
    })
    expect(routes).toMatchSnapshot()
  })
})

function visitFilesFromArray(files: string[]) {
  return (_dir: string, visitor: (file: string) => void, _baseDir?: string) => {
    files.forEach(file => {
      visitor(file)
    })
  }
}
