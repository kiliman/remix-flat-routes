import { parseRouteFile, RouteInfo } from '../src/index'

describe('parse flat routes', () => {
  // description, route, expected
  const routes: [string, string, RouteInfo][] = [
    [
      'route with pathless layout',
      '_auth.forgot-password.tsx',
      {
        path: '/forgot-password',
        name: '_auth.forgot-password',
        file: 'routes/_auth.forgot-password.tsx',
        parent: '_auth',
        isIndex: false,
      },
    ],
    [
      'pathless layout',
      '_auth.tsx',
      {
        path: '',
        name: '_auth',
        file: 'routes/_auth.tsx',
        parent: 'root',
        isIndex: false,
      },
    ],
    [
      'index route with layout',
      'app.calendar.index.tsx',
      {
        path: '/app/calendar/',
        name: 'app.calendar.index',
        file: 'routes/app.calendar.index.tsx',
        parent: 'app.calendar',
        isIndex: true,
      },
    ],
    [
      'route with dynamic param',
      'app.calendar.$day.tsx',
      {
        path: '/app/calendar/:day',
        name: 'app.calendar.$day',
        file: 'routes/app.calendar.$day.tsx',
        parent: 'app.calendar',
        isIndex: false,
      },
    ],
    [
      'route with stop parent',
      'app_.projects.$id.roadmap.tsx',
      {
        path: '/app/projects/:id/roadmap',
        name: 'app_.projects.$id.roadmap',
        file: 'routes/app_.projects.$id.roadmap.tsx',
        parent: 'root', // stop parent before app so 'root'
        isIndex: false,
      },
    ],
    [
      'route with escaped path',
      'app_.projects.$id.roadmap[.pdf].tsx',
      {
        path: '/app/projects/:id/roadmap.pdf',
        name: 'app_.projects.$id.roadmap[.pdf]',
        file: 'routes/app_.projects.$id.roadmap[.pdf].tsx',
        parent: 'root', // stop parent before app so 'root'
        isIndex: false,
      },
    ],
    [
      'route with multiple dynamic params',
      'app.projects.$id.$name.tsx',
      {
        path: '/app/projects/:id/:name',
        name: 'app.projects.$id.$name',
        file: 'routes/app.projects.$id.$name.tsx',
        parent: 'app.projects.$id',
        isIndex: false,
      },
    ],
    [
      'route with higher level parent',
      'app.projects.$id_.$name.tsx',
      {
        path: '/app/projects/:id/:name',
        name: 'app.projects.$id_.$name',
        file: 'routes/app.projects.$id_.$name.tsx',
        parent: 'app.projects',
        isIndex: false,
      },
    ],
    [
      'splat route',
      'docs.$.tsx',
      {
        path: '/docs/*',
        name: 'docs.$',
        file: 'routes/docs.$.tsx',
        parent: 'docs',
        isIndex: false,
      },
    ],
  ]

  test.each(routes)('%s: %s', (_description, route, expected) => {
    const result = parseRouteFile('routes', route)
    expect(result).toEqual(expected)
  })
})

describe('parse nested-flat routes', () => {
  // description, route, expected
  const routes: [string, string, RouteInfo][] = [
    [
      'route with pathless layout',
      '_auth.forgot-password/index.tsx',
      {
        path: '/forgot-password',
        name: '_auth.forgot-password',
        file: 'routes/_auth.forgot-password/index.tsx',
        parent: '_auth',
        isIndex: false,
      },
    ],
    [
      'pathless layout (using _layout name)',
      '_auth/_layout.tsx',
      {
        path: '',
        name: '_auth',
        file: 'routes/_auth/_layout.tsx',
        parent: 'root',
        isIndex: false,
      },
    ],
    [
      'index route with layout (using _route name)',
      'app.calendar.index/_route.tsx',
      {
        path: '/app/calendar/',
        name: 'app.calendar.index',
        file: 'routes/app.calendar.index/_route.tsx',
        parent: 'app.calendar',
        isIndex: true,
      },
    ],
    [
      'route with dynamic param',
      'app.calendar.$day/index.tsx',
      {
        path: '/app/calendar/:day',
        name: 'app.calendar.$day',
        file: 'routes/app.calendar.$day/index.tsx',
        parent: 'app.calendar',
        isIndex: false,
      },
    ],
    [
      'route with stop parent',
      'app_.projects.$id.roadmap/index.tsx',
      {
        path: '/app/projects/:id/roadmap',
        name: 'app_.projects.$id.roadmap',
        file: 'routes/app_.projects.$id.roadmap/index.tsx',
        parent: 'root', // stop parent before app so 'root'
        isIndex: false,
      },
    ],
    [
      'route with escaped path',
      'app_.projects.$id.roadmap[.pdf]/index.tsx',
      {
        path: '/app/projects/:id/roadmap.pdf',
        name: 'app_.projects.$id.roadmap[.pdf]',
        file: 'routes/app_.projects.$id.roadmap[.pdf]/index.tsx',
        parent: 'root', // stop parent before app so 'root'
        isIndex: false,
      },
    ],
    [
      'route with multiple dynamic params',
      'app.projects.$id.$name/index.tsx',
      {
        path: '/app/projects/:id/:name',
        name: 'app.projects.$id.$name',
        file: 'routes/app.projects.$id.$name/index.tsx',
        parent: 'app.projects.$id',
        isIndex: false,
      },
    ],
    [
      'route with higher level parent',
      'app.projects.$id_.$name/index.tsx',
      {
        path: '/app/projects/:id/:name',
        name: 'app.projects.$id_.$name',
        file: 'routes/app.projects.$id_.$name/index.tsx',
        parent: 'app.projects',
        isIndex: false,
      },
    ],
    [
      'splat route',
      'docs.$/index.tsx',
      {
        path: '/docs/*',
        name: 'docs.$',
        file: 'routes/docs.$/index.tsx',
        parent: 'docs',
        isIndex: false,
      },
    ],
    [
      'splat route with no layout',
      'docs.$_/index.tsx',
      {
        path: '/docs/*',
        name: 'docs.$_',
        file: 'routes/docs.$_/index.tsx',
        parent: 'docs',
        isIndex: false,
      },
    ],
    [
      'splat route with root layout',
      'docs_.$/index.tsx',
      {
        path: '/docs/*',
        name: 'docs_.$',
        file: 'routes/docs_.$/index.tsx',
        parent: 'root',
        isIndex: false,
      },
    ],
  ]

  test.each(routes)('%s: %s', (_description, route, expected) => {
    const result = parseRouteFile('routes', route)
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
    const result = parseRouteFile('routes', route)
    expect(result).toEqual(expected)
  })
})
