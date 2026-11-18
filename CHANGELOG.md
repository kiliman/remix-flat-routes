# CHANGELOG

## v0.8.6
- 🔒 Upgrade `minimatch` to v11 to fix denial-of-service advisories GHSA-3ppc-4f35-3m26, GHSA-7r86-cg39-jmmj, GHSA-23c5-xmqv-rm74 and GHSA-g3hv-75wg-m249 (thanks [@bradbyte](https://github.com/bradbyte)!) [#160](https://github.com/kiliman/remix-flat-routes/pull/160)
- 🔨 `engines.node` is now `>=20`, matching what `minimatch` has required since 0.7.0 [#161](https://github.com/kiliman/remix-flat-routes/pull/161)
- 📦 Update dependencies and remove unused dev dependencies [#161](https://github.com/kiliman/remix-flat-routes/pull/161) [#162](https://github.com/kiliman/remix-flat-routes/pull/162) [#163](https://github.com/kiliman/remix-flat-routes/pull/163) [#164](https://github.com/kiliman/remix-flat-routes/pull/164)

## v0.8.5
- 🔨 Don't require react-router >=7 if installed; today's version is still kind of independent of react-router.

## v0.8.4
- 🐛 Remove unnecessary trailing slash from path [#130](https://github.com/kiliman/remix-flat-routes/issues/130)

## v0.8.3
- 🔨 Don't compile unnecessary files during the build

## v0.8.2
- 🐛 Fix bug of `npx migrate-flat-routes` due to ESM/CJS build

## v0.8.1
- 🐛 Addresses bug of `npx migrate-flat-routes` due to ESM/CJS build

## v0.8.0

Full changes in PR [#70](https://github.com/kiliman/remix-flat-routes/pull/70)
- ✨New option `nestedDirectoryChar` introduced [#57](https://github.com/kiliman/remix-flat-routes/issues/57) [#106](https://github.com/kiliman/remix-flat-routes/issues/106)
- ✨ESM support added

## v0.7.2

Full changes in PR [#148](https://github.com/kiliman/remix-flat-routes/pull/148)
- 🐛 Allow escaping underscore on route file.
- 🔨 Make peer dependency `react-router` optional
- ✨ Add test to verify special character escape cases.

## v0.7.1

Minor fixes. Full changes in PR [#147](https://github.com/kiliman/remix-flat-routes/pull/147)
- 🐛 Use `peerDependency` `react-router: ^7` instead of `^7.0.0`
- 🐛 Fix contributors `projectName` and typo inside `src/index.ts`

## v0.7.0

- 🔨 Removes requirement of @remix-run dependencies [#144](https://github.com/kiliman/remix-flat-routes/pull/144) [#138](https://github.com/kiliman/remix-flat-routes/issues/138)
- 📦 Update dependencies to the latest stable version

## v0.6.5

- 🐛 Check if remix.config.js exists before using during migration [#121](https://github.com/kiliman/remix-flat-routes/issues/121)

## v0.6.4

- 🐛 Import remix.config to use `ignoredRouteFiles` setting [#93](https://github.com/kiliman/remix-flat-routes/issue/93)
- ✨ feat: Follow symlinks [#90](https://github.com/kiliman/remix-flat-routes/pull/90)

## v0.6.2

- 🐛 Fix migration with pathless layouts [#79](https://github.com/kiliman/remix-flat-routes/issue/79)
- ✨ Add `--force` CLI option to remove target folder before migration

## v0.6.1

- ✨ Add `--hybrid` convention to migration script [#78](https://github.com/kiliman/remix-flat-routes/issue/78)

## v0.6.0

- 🔨 Rewrite migration script

## v0.5.12

- 📦 Update @remix-run/v1-route-convention package for v2 dependency [#74](https://github.com/kiliman/remix-flat-routes/issue/74)

## v0.5.11

- 🔨 Update peerDependency to include Remix v2 [#72](https://github.com/kiliman/remix-flat-routes/pull/72)

## v0.5.10

- 🔨 Add support for `+/_.` convention to override parent layout [#58](https://github.com/kiliman/remix-flat-routes/issues/58)

## v0.5.9

- 🔨 Update migration script to use `v1-route-convention` package [#46](https://github.com/kiliman/remix-flat-routes/issues/46)
- 🐛 Normalize Windows path for routes config [#59](https://github.com/kiliman/remix-flat-routes/issues/59)
- 🔥 Remove index hack since it is fixed in Remix
- 🔥 Remove uniqueness check from `v2` routing because it is buggy

## v0.5.8

- 🐛 Fix last segment finding on Windows [#40](https://github.com/kiliman/remix-flat-routes/pull/40)

## v0.5.7

- 🐛 Fix import path for Remix 1.6.2+ [#35](https://github.com/kiliman/remix-flat-routes/pull/35)

## v0.5.6

- 🐛 Simplify regex for routes and fix optional routes with folders [#28](https://github.com/kiliman/remix-flat-routes/issues/28)

## v0.5.5

- 🐛 Handle optional segments with param [#30](https://github.com/kiliman/remix-flat-routes/issues/30)

## v0.5.4

- 🐛 Fix route matching on Windows

## v0.5.3

- 🐛 Make unique route id check optional [#29](https://github.com/kiliman/remix-flat-routes/issues/29)

## v0.5.2

- 🐛 Fix flat-files folder support on Windows [#27](https://github.com/kiliman/remix-flat-routes/issues/27)
- ✨ Add `appDir` option [#26](https://github.com/kiliman/remix-flat-routes/issues/26)

## v0.5.1

- 🔨 Add support for folders with `flat-files` convention [#25](https://github.com/kiliman/remix-flat-routes/discussions/25)

## v0.5.0

- 🔨 Update flatRoutes with new features
  - Uses same function as Remix core
  - Allows to maintain extended flat-routes function
  - Customizations passed in `options`
  - Add support for "hybrid" routes
  - Add support for extended route filenames
  - Add support for multiple route folders
  - Add support for custom param prefix character
  - Add support for custom base path

## v0.4.7

- 🔨 Modify route ids for index routes to workaround bug in Remix
  - See Remix PR [#4560](https://github.com/remix-run/remix/pull/4560)

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
