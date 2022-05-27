import * as path from 'path'
import { convertToRoute } from '../src/migrate'

describe('migrate default routes to flat-files', () => {
  // route, expected
  const routes: [string, string][] = [
    ['index.tsx', '_index'],
    ['accounts.tsx', 'accounts'],
    ['sales/invoices.tsx', 'sales.invoices'],
    ['sales/invoices/index.tsx', 'sales.invoices._index'],
    ['sales/invoices/$invoiceId.tsx', 'sales.invoices.$invoiceId'],
    ['sales/invoices/$invoiceId.edit.tsx', 'sales.invoices.$invoiceId.edit'],
    ['__landing.tsx', '_landing'],
    ['__landing/index.tsx', '_landing._index'],
    ['__landing/login.tsx', '_landing.login'],
    ['app.projects.$id.roadmap.tsx', 'app.projects.$id.roadmap'],
  ]

  test.each(routes)('%s: %s', (route, expected) => {
    let extension = path.extname(route)
    let name = route.substring(0, route.length - extension.length)

    const result = convertToRoute(name)
    expect(result).toEqual(expected)
  })
})

describe('migrate multiple params, no parent', () => {
  // route, expected
  const routes: [string, string][] = [
    ['index.tsx', '_index'],
    ['healthcheck.tsx', 'healthcheck'],
    ['$lang.$ref.tsx', '$lang.$ref'],
    ['$lang.$ref/$.tsx', '$lang.$ref.$'],
    ['$lang.$ref/index.tsx', '$lang.$ref._index'],
  ]

  test.each(routes)('%s: %s', (route, expected) => {
    let extension = path.extname(route)
    let name = route.substring(0, route.length - extension.length)

    const result = convertToRoute(name)
    expect(result).toEqual(expected)
  })
})
