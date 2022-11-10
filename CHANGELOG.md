# CHANGELOG

## v0.4.6

- 🔨 Update build to use tsc compiler to generate type definitions [#21](https://github.com/kiliman/remix-flat-routes/issues/21)

## v0.4.5

- 🐛 Fix path generation to ensure relative paths [#14](https://github.com/kiliman/remix-flat-routes/issues/14)
  - Couple of issues in Remix that cause problem when posting to index routes. Here is a link to patches that will fix this problem. https://gist.github.com/kiliman/6ecc2186d487baa248d65f79128f72f6
- 🐛 Handle ignored files starting with dots
- ✨ Add paramPrefixChar to config
  - Since the `$` prefix makes it hard to work with files in the shell, you can choose a different character like `^`

## v0.4.4

- 🔨 Add `ignoredRouteFiles` to `flatRoutes` options [#15](https://github.com/kiliman/remix-flat-routes/issues/15)

## v0.4.3

- 🐛 Use correct path for index routes [#13](https://github.com/kiliman/remix-flat-routes/issues/13)

## v0.4.2

- 🐛 Fix params with trailing slash [#11](https://github.com/kiliman/remix-flat-routes/issues/11)

## v0.4.1

- 🐛 Fix parent handling and trailing `_` in path [#11](https://github.com/kiliman/remix-flat-routes/issues/11)

## v0.4.0

- 🔨 Rewrite how parent routes are calculated [#9](https://github.com/kiliman/remix-flat-routes/issues/9)
- 🐛 Use `path.sep` to support Windows [#10](https://github.com/kiliman/remix-flat-routes/issues/10)

## v0.3.1

- 🔨 Add support for MDX files [#7](https://github.com/kiliman/remix-flat-routes/pull/6)

## v0.3.0

- ✨ Add `basePath` option to mount routes to path other than root
- 🔨 Add more TypeScript types
- ♻️ Refactor tests

## v0.2.1

- 🔨 Add shebang to cli.js script
- 🔨 Check that source directory exists before processing

## v0.2.0

- ✨ Add new command to migrate existing routes to new convention
- ✅ Add tests for migration

## v0.1.0

- ✅ Add tests for parseRouteModule
- 🐛 Fix issue with parent modules not matching with dynamic params

## v0.0.4

- 🐛 Fix check for index file

## v0.0.2

- 🔨 Add support for explicit `_layout.tsx` file

## v0.0.1

- 🎉 Initial import
