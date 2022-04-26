import type { RouteInfo } from '../src/index'

// description, route, expected
export const routes: [string, string, RouteInfo][] = [
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
