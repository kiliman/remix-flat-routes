import * as path from 'path'
import { convertToRoute } from '../src/migrate'

describe('migrate default routes to flat-routes', () => {
  // route, expected
  const routes: [string, string][] = [
    ['index.tsx', 'index'],
    ['accounts.tsx', 'accounts'],
    ['sales/invoices.tsx', 'sales.invoices'],
    ['sales/invoices/index.tsx', 'sales.invoices.index'],
    ['sales/invoices/$invoiceId.tsx', 'sales.invoices.$invoiceId'],
    ['sales/invoices/$invoiceId.edit.tsx', 'sales.invoices.$invoiceId_.edit'],
    ['__landing.tsx', '_landing'],
    ['__landing/index.tsx', '_landing.index'],
    ['__landing/login.tsx', '_landing.login'],
    ['app.projects.$id.roadmap.tsx', 'app_.projects.$id.roadmap'],
  ]

  test.each(routes)('%s: %s', (route, expected) => {
    let extension = path.extname(route)
    let name = route.substring(0, route.length - extension.length)

    const result = convertToRoute(name)
    expect(result).toEqual(expected)
  })
})
