import * as path from 'path'

type RouteConfig = {
  file: string
  path: string
  parentId: string
  index: boolean
}

describe('migrate default routes to flat-files', () => {
  // route, expected
  const routes: [RouteConfig, string][] = [
    [{ file: 'index.tsx', path: '', parentId: 'root', index: true }, '_index'],
    [
      {
        file: 'accounts.tsx',
        path: 'accounts',
        parentId: 'root',
        index: false,
      },
      'accounts',
    ],
    [
      {
        file: 'sales/invoices.tsx',
        path: 'invoices',
        parentId: 'sales',
        index: false,
      },
      'sales.invoices',
    ],
    [
      {
        file: 'sales/invoices/index.tsx',
        path: '',
        parentId: 'sales',
        index: true,
      },
      'sales.invoices._index',
    ],
    [
      {
        file: 'sales/invoices/$invoiceId.tsx',
        path: ':invoiceId',
        parentId: 'sales/invoices',
        index: false,
      },
      'sales.invoices.$invoiceId',
    ],
    [
      {
        file: 'sales/invoices/$invoiceId.edit.tsx',
        path: ':invoiceId/edit',
        parentId: 'sales/invoices',
        index: false,
      },
      'sales.invoices.$invoiceId_.edit',
    ],
    [
      { file: '__landing.tsx', path: '', parentId: 'root', index: false },
      '_landing',
    ],
    [
      {
        file: '__landing/index.tsx',
        path: '',
        parentId: '__landing',
        index: true,
      },
      '_landing._index',
    ],
    [
      {
        file: '__landing/login.tsx',
        path: 'login',
        parentId: '__landing',
        index: false,
      },
      '_landing.login',
    ],
    [
      {
        file: 'app.projects.$id.roadmap.tsx',
        path: 'app/projects/:id/roadmap',
        parentId: 'root',
        index: false,
      },
      'app.projects.$id.roadmap',
    ],
  ]
  runTests(routes)
})

describe('migrate multiple params, no parent', () => {
  // route, expected
  const routes: [RouteConfig, string][] = [
    [
      {
        file: 'healthcheck.tsx',
        path: 'healthcheck',
        parentId: 'root',
        index: false,
      },
      'healthcheck',
    ],
    [
      {
        file: '$lang.$ref.tsx',
        path: ':lang/:ref',
        parentId: 'root',
        index: false,
      },
      '$lang.$ref',
    ],
    [
      {
        file: '$lang.$ref/$.tsx',
        path: '*',
        parentId: '$lang.$ref',
        index: false,
      },
      '$lang.$ref.$',
    ],
    [
      {
        file: '$lang.$ref/index.tsx',
        path: '',
        parentId: '$lang.$ref',
        index: true,
      },
      '$lang.$ref._index',
    ],
  ]

  runTests(routes)
})

describe('test single leading _', () => {
  // route, expected
  const routes: [RouteConfig, string][] = [
    [
      { file: '_route.tsx', path: '_route', parentId: 'root', index: true },
      '[_]route',
    ],
  ]
  runTests(routes)
})

describe('test pathless layouts', () => {
  // route, expected
  const routes: [RouteConfig, string][] = [
    [
      {
        file: '__index/resources/onboarding.tsx',
        path: 'resources/onboarding',
        parentId: '__index',
        index: false,
      },
      '_index.resources.onboarding.tsx',
    ],
  ]
  runTests(routes)
})

function runTests(routes: [RouteConfig, string][]) {
  test.each(routes)('%s: %s', (route, expected) => {
    const {
      file,
      path: routePath,
      parentId,
      index,
    } = normalizeRoute(route, 'routes')
    let extension = path.extname(file)
    let name = file.substring(0, file.length - extension.length)

    // TODO: I'll come back to this later
    const result = '' //convertToRoute(name, parentId, routePath, index)
    expect(result).toEqual('routes.' + expected)
  })
}

function normalizeRoute(route: RouteConfig, basePath: string) {
  route.file = path.join(basePath, route.file)
  if (route.parentId !== 'root') {
    route.parentId = path.join(basePath, route.parentId)
  }
  return route
}
