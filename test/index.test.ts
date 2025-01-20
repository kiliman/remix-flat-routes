import type { RouteManifest } from '../src/index'
import flatRoutes from '../src/index'
import { defineRoutes } from '../src/routes'

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
      '$lang.$ref/route.tsx',
      '$lang.$ref._index/route.tsx',
      '$lang.$ref.$/route.tsx',
      '_index/route.tsx',
      'healthcheck/route.tsx',
    ]
    const routes = flatRoutes('routes', defineRoutes, {
      visitFiles: visitFilesFromArray(flatFolders),
    })
    expect(routes).toMatchSnapshot()
  })
  it('should define routes for flat-folders on Windows', () => {
    const flatFolders = [
      '$lang.$ref\\route.tsx',
      '$lang.$ref._index\\route.tsx',
      '$lang.$ref.$\\route.tsx',
      '_index\\route.tsx',
      'healthcheck\\route.tsx',
    ]
    const routes = flatRoutes('routes', defineRoutes, {
      visitFiles: visitFilesFromArray(flatFolders),
    })
    expect(routes['routes/$lang.$ref._index/route']).toBeDefined()
    expect(routes['routes/$lang.$ref._index/route'].parentId).toBe(
      'routes/$lang.$ref/route',
    )
    expect(routes['routes/$lang.$ref._index/route'].file).toBe(
      'routes/$lang.$ref._index/route.tsx',
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
      'parent.some_.nested.page.tsx',
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
      '$lang.$ref._index/route.tsx',
      '$lang.$ref._index/style.css',
      '$lang.$ref.$/model.server.ts',
      '_index/route.tsx',
      'healthcheck/route.tsx',
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
      path: route.path!,
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

describe('define ignored routes', () => {
  const ignoredRouteFiles = ['**/.*', '**/*.css', '**/*.test.{js,jsx,ts,tsx}']
  it('should ignore routes for flat-files', () => {
    const flatFiles = [
      '$lang.$ref.tsx',
      '$lang.$ref._index.tsx',
      '$lang.$ref.$.tsx',
      '_index.tsx',
      'healthcheck.tsx',
      'style.css',
      '_index.test.tsx',
      'styles/style.css',
      '__tests__/route.test.tsx',
    ]
    const routes = flatRoutes('routes', defineRoutes, {
      visitFiles: visitFilesFromArray(flatFiles),
      ignoredRouteFiles,
    })
    expect(routes).toMatchSnapshot()
  })
})

describe('define index routes', () => {
  it('should generate "correct" id for index routes for flat files', () => {
    const flatFiles = [
      '$lang.$ref.tsx',
      '$lang.$ref._index.tsx',
      '$lang.$ref.$.tsx',
      '_index.tsx',
    ]
    const routes = flatRoutes('routes', defineRoutes, {
      visitFiles: visitFilesFromArray(flatFiles),
    })

    expect(routes['routes/_index'].index).toBe(true)
    expect(routes['routes/$lang.$ref._index'].index).toBe(true)
  })

  it('should generate "correct" id for index routes for flat folders', () => {
    const flatFolders = [
      '$lang.$ref/route.tsx',
      '$lang.$ref._index/route.tsx',
      '$lang.$ref.$/route.tsx',
      '_index/route.tsx',
    ]
    const routes = flatRoutes('routes', defineRoutes, {
      visitFiles: visitFilesFromArray(flatFolders),
    })
    expect(routes['routes/_index/route'].index).toBe(true)
    expect(routes['routes/$lang.$ref._index/route'].index).toBe(true)
  })
})

describe('use custom base path', () => {
  it('should generate correct routes with base path prefix', () => {
    const flatFiles = [
      '$lang.$ref.tsx',
      '$lang.$ref._index.tsx',
      '$lang.$ref.$.tsx',
      '_index.tsx',
    ]
    const routes = flatRoutes('routes', defineRoutes, {
      visitFiles: visitFilesFromArray(flatFiles),
      basePath: '/myapp',
    })
    const rootChildren = Object.values(routes).filter(
      route => route.parentId === 'root',
    )
    expect(rootChildren.length).toBeGreaterThan(0)
    expect(rootChildren[0].path!.startsWith('myapp/')).toBe(true)
  })
})

describe('use custom param prefix char', () => {
  it('should generate correct paths with custom param prefix', () => {
    const flatFiles = ['^userId.tsx', '^.tsx']
    const routes = flatRoutes('routes', defineRoutes, {
      visitFiles: visitFilesFromArray(flatFiles),
      paramPrefixChar: '^',
    })
    expect(routes['routes/^userId']!.path!).toBe(':userId')
    expect(routes['routes/^']!.path!).toBe('*')
  })
})

describe('use optional segments', () => {
  it('should generate correct paths with optional syntax', () => {
    const files = ['parent.(child).tsx']
    const routes = flatRoutes('routes', defineRoutes, {
      visitFiles: visitFilesFromArray(files),
    })
    expect(routes['routes/parent.(child)']!.path!).toBe('parent/child?')
  })
  it('should generate correct paths with folders', () => {
    const files = ['_folder+/parent.(child).tsx']
    const routes = flatRoutes('routes', defineRoutes, {
      visitFiles: visitFilesFromArray(files),
    })
    expect(routes['routes/_folder+/parent.(child)']!.path!).toBe(
      'parent/child?',
    )
  })
  it('should generate correct paths with optional syntax and dynamic param', () => {
    const files = ['parent.($child).tsx']
    const routes = flatRoutes('routes', defineRoutes, {
      visitFiles: visitFilesFromArray(files),
    })
    expect(routes['routes/parent.($child)']!.path!).toBe('parent/:child?')
  })
})

describe('define hybrid routes', () => {
  it('should define routes for hybrid routes', () => {
    const flatFolders = [
      '_index/route.tsx',
      '_public/_layout.tsx',
      '_public/about/route.tsx',
      '_public/contact[.jpg]/route.tsx',
      'test.$/route.tsx',
      'users/_layout.tsx',
      'users/users.css',
      'users/route/route.tsx',
      'users/$userId/route.tsx',
      'users/$userId/avatar.png',
      'users/$userId_.edit/route.tsx',
    ]
    const routes = flatRoutes('routes', defineRoutes, {
      visitFiles: visitFilesFromArray(flatFolders),
    })
    expect(routes).toMatchSnapshot()
  })
})

describe('define folders for flat-files', () => {
  it('should define routes for flat-files with folders', () => {
    const flatFolders = [
      '_auth+/forgot-password.tsx',
      '_auth+/login.tsx',
      '_public+/_layout.tsx',
      '_public+/index.tsx',
      '_public+/about.tsx',
      '_public+/contact[.jpg].tsx',
      'users+/_layout.tsx',
      'users+/route.tsx',
      'users+/$userId.tsx',
      'users+/$userId_.edit.tsx',
    ]
    const routes = flatRoutes('routes', defineRoutes, {
      visitFiles: visitFilesFromArray(flatFolders),
    })
    expect(routes).toMatchSnapshot()
  })
  it('should define routes with flat-files hybrid with parent layout override', () => {
    const flatFolders = [
      '_index.tsx',
      'faculty+/_layout.tsx',
      'faculty+/index.tsx',
      'faculty+/_.login.tsx',
    ]
    const routes = flatRoutes('routes', defineRoutes, {
      visitFiles: visitFilesFromArray(flatFolders),
    })
    expect(routes['routes/faculty+/_.login']?.parentId).toBe('root')
  })

  it('should define routes for flat-files with folders and flat-folders convention', () => {
    const flatFolders = [
      '_public+/parent.child/index.tsx',
      '_public+/parent.child.grandchild/index.tsx',
    ]
    const routes = flatRoutes('routes', defineRoutes, {
      visitFiles: visitFilesFromArray(flatFolders),
    })
    expect(routes['routes/_public+/parent.child/index']?.path).toBe(
      'parent/child',
    )
    expect(
      routes['routes/_public+/parent.child.grandchild/index']?.parentId,
    ).toBe('routes/_public+/parent.child/index')
    expect(routes['routes/_public+/parent.child.grandchild/index']?.path).toBe(
      'grandchild',
    )
  })
  it('should define routes for flat-files with folders on windows', () => {
    const flatFolders = [
      '_public+\\parent.child.tsx',
      '_public+\\parent.child.grandchild.tsx',
    ]
    const routes = flatRoutes('routes', defineRoutes, {
      visitFiles: visitFilesFromArray(flatFolders),
    })
    expect(routes['routes/_public+/parent.child']?.path).toBe('parent/child')
    expect(routes['routes/_public+/parent.child.grandchild']?.parentId).toBe(
      'routes/_public+/parent.child',
    )
    expect(routes['routes/_public+/parent.child.grandchild']?.path).toBe(
      'grandchild',
    )
  })
})
