import { defineRoutes } from '@remix-run/dev/config/routes'
import type { RouteManifest } from '../src/index'
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

  it('should correctly nest routes', () => {
    const routeList = [
      'app.$organizationSlug.tsx',
      'app.$organizationSlug.edit.tsx',
      'app.$organizationSlug.projects.tsx',
      'app.$organizationSlug.projects.$projectId.tsx',
      'app.$organizationSlug.projects.$projectId.edit.tsx',
      'app.$organizationSlug.projects.new.tsx',
    ]
    const routes = flatRoutes('routes', defineRoutes, {
      visitFiles: visitFilesFromArray(routeList),
    })
    expect(routes).toMatchSnapshot()
  })
  it('should allow routes to specify different parent routes', () => {
    const routeList = [
      'parent.tsx',
      'parent.some.nested.tsx',
      'parent.some_.nested.route.tsx',
    ]
    const routes = flatRoutes('routes', defineRoutes, {
      visitFiles: visitFilesFromArray(routeList),
    })
    expect(routes).toMatchSnapshot()
  })
  it('should handle params with trailing underscore', () => {
    const routeList = [
      'app.$organizationSlug_._projects.tsx',
      'app.$organizationSlug_._projects.projects.new.tsx',
      'app.$organizationSlug_._projects.projects.$projectId.tsx',
      'app.$organizationSlug_._projects.projects.$projectId.edit.tsx',
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

type RouteMapInfo = {
  id: string
  path: string
  file: string
  index?: boolean
  children: string[]
}
function dumpRoutes(routes: RouteManifest) {
  const routeMap = new Map<string, RouteMapInfo>()
  const rootRoute: RouteMapInfo = {
    id: 'root',
    path: '',
    file: 'root.tsx',
    index: false,
    children: [],
  }
  routeMap.set('root', rootRoute)
  Object.entries(routes).forEach(([name, route]) => {
    if (!route.parentId) return
    const parent = routeMap.get(route.parentId)
    if (parent) {
      parent.children.push(name)
    }
    routeMap.set(name, {
      id: name,
      path: route.path,
      file: route.file,
      index: route.index,
      children: [],
    })
  })
  const dump = (route: RouteMapInfo, indent: string) => {
    const getPath = (path?: string) => (path ? `path="${path}" ` : '')
    const getIndex = (index?: boolean) => (index ? 'index ' : '')
    output += `${indent}<Route ${getIndex(route.index)}${getPath(
      route.path,
    )}file="${route.file}"${route.children ? '' : ' /'}>\n`
    if (route.children.length) {
      route.children.forEach((childId: string) => {
        dump(routeMap.get(childId)!, indent + '  ')
      })
      output += `${indent}</Route>\n`
    }
  }
  let output = '<Routes>\n'
  dump(routeMap.get('root')!, '  ')
  output += '</Routes>\n'
  console.log(output)
}
