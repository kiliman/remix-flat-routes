import type { RouteInfo } from '../src/index'

// description, route, expected
export const routes: [string, string, RouteInfo][] = [
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
