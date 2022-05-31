# CHANGELOG

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
