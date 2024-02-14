# Remix Flat Routes

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-9-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

This package enables you to define your routes using the `flat-routes` convention. This is based on the [gist](https://gist.github.com/ryanflorence/0dcc52c2332c2f6e1b52925195f87baf) by Ryan Florence

## ✨🎉 New in v0.5.0

### Remix v2 flat routes convention

`remix-flat-routes` was the initial implementation of the flat-routes specification. I added some enhancements
based on user feedback. When Remix v2 added the flat-routes convention as the default, they used _only_ the 
original specification.

If you want enhancements like *hybrid routes*, extended route filenames, custom param prefix, etc., you will
need to continue to use this package.

`remix-flat-routes` will always maintain compatibility with the default Remix convention. This package is simply
a superset/extension of the core convention.

> NOTE: popular projects like Kent C. Dodds' [Epic Stack](https://github.com/epicweb-dev/epic-stack) uses `remix-flat-routes`

### Hybrid Routes

You can now use nested folders for your route names, yet still keep the colocation feature of flat routes.

If you have a large app, its not uncommon to have routes nested many levels deep. With default flat routes, the folder name is the entire route path: `some.really.long.route.edit/index.tsx`

Often you may have several parent layouts like `_public` or `admin`. Instead of having to repeat the name in every route, you can create top-level folders, then nest your routes under them. This way you can still take advantage of flat folders with colocation.

**Before**

```shell
❯ tree app/routes-folders
app/routes-folders
├── _index
│   └── page.tsx
├── _public
│   └── _layout.tsx
├── _public.about
│   └── index.tsx
├── _public.contact[.jpg]
│   └── index.tsx
├── test.$
│   ├── _route.server.tsx
│   └── _route.tsx
├── users
│   ├── _layout.tsx
│   └── users.css
├── users.$userId
│   ├── _route.tsx
│   └── avatar.png
├── users.$userId_.edit
│   └── _route.tsx
└── users._index
    └── index.tsx
```

**After**

```shell
❯ tree app/routes-hybrid
app/routes-hybrid
├── _index
│   └── index.tsx
├── _public
│   ├── _layout.tsx
│   ├── about
│   │   └── _route.tsx
│   └── contact[.jpg]
│       └── _route.tsx
├── test.$
│   └── _route.tsx
└── users
    ├── $userId
    │   ├── _route.tsx
    │   └── avatar.png
    ├── $userId_.edit
    │   └── _route.tsx
    ├── _index
    │   └── index.tsx
    ├── _layout.tsx
    └── users.css
```

### Nested folders with `flat-files` convention (✨ New in v0.5.1)

To create a folder but treat it as flat-file, just append the `+`to the folder name.

```
_auth+/forgot-password.tsx => _auth.forgot-password.tsx
```

> NOTE: You can include the \_layout.tsx file inside your folder. You do NOT need to have a \_public.tsx or users.tsx file.

> You can still use flat-folders for colocation. So this is best of both formats.

```
❯ tree app/routes-hybrid-files/
app/routes-hybrid-files/
├── _auth+
│   ├── forgot-password.tsx
│   └── login.tsx
├── _public+
│   ├── _layout.tsx
│   ├── about.tsx
│   ├── contact[.jpg].tsx
│   └── index.tsx
├── project+
│   ├── _layout.tsx
│   ├── parent.child
│   │   └── index.tsx
│   └── parent.child.grandchild
│       ├── index.tsx
│       └── styles.css
└── users+
    ├── $userId.tsx
    ├── $userId_.edit.tsx
    ├── _layout.tsx
    └── index.tsx
```

```js
<Routes>
  <Route file="root.tsx">
    <Route
      path="forgot-password"
      file="routes-hybrid-files/_auth+/forgot-password.tsx"
    />
    <Route path="login" file="routes-hybrid-files/_auth+/login.tsx" />
    <Route file="routes-hybrid-files/_public+/_layout.tsx">
      <Route path="about" file="routes-hybrid-files/_public+/about.tsx" />
      <Route
        path="contact.jpg"
        file="routes-hybrid-files/_public+/contact[.jpg].tsx"
      />
      <Route index file="routes-hybrid-files/_public+/index.tsx" />
    </Route>
    <Route path="project" file="routes-hybrid-files/project+/_layout.tsx">
      <Route
        path="parent/child"
        file="routes-hybrid-files/project+/parent.child/index.tsx"
      >
        <Route
          path="grandchild"
          file="routes-hybrid-files/project+/parent.child.grandchild/index.tsx"
        />
      </Route>
    </Route>
    <Route path="users" file="routes-hybrid-files/users+/_layout.tsx">
      <Route path=":userId" file="routes-hybrid-files/users+/$userId.tsx" />
      <Route
        path=":userId/edit"
        file="routes-hybrid-files/users+/$userId_.edit.tsx"
      />
      <Route index file="routes-hybrid-files/users+/index.tsx" />
    </Route>
  </Route>
</Routes>
```

### Extended Route Filenames

In addition to the standard `index | route | page | layout` names, any file that has a `_` prefix will be treated as the route file. This will make it easier to find a specific route instead of looking through a bunch of `route.tsx` files. This was inspired by [SolidStart](https://start.solidjs.com/core-concepts/routing) "Renaming Index" feature.

So instead of

```
_public.about/route.tsx
_public.contact/route.tsx
_public.privacy/route.tsx
```

You can name them

```
_public.about/_about.tsx
_public.contact/_contact.tsx
_public.privacy/_privacy.tsx
```

### Multiple Route Folders

You can now pass in additional route folders besides the default `routes` folder. These routes will be merged into a single namespace, so you can have routes in one folder that will use shared routes from another.

### Custom Param Prefix

You can override the default param prefix of `$`. Some shells use the `$` prefix for variables, and this can be an issue due to shell expansion. Use any character that is a valid filename, for example: `^`

```
users.^userId.tsx  => users/:userId
test.^.tsx         => test/*
```

### Custom Base Path

You can override the default base path of `/`. This will prepend your base path to the root path.

### Optional Route Segments

React Router will introduce a new feature for optional route segments. To use optional segments in flat routes, simply wrap your route name in `()`.

```
parent.(optional).tsx   => parent/optional?
```

### Custom App Directory

You can override the default app directory of `app`.

## 🛠 Installation

```bash
npm install -D remix-flat-routes
```

## ⚙️ Configuration

Update your _remix.config.js_ file and use the custom routes config option.

```ts
const { flatRoutes } = require('remix-flat-routes')

/**
 * @type {import("@remix-run/dev").AppConfig}
 */
module.exports = {
  // ignore all files in routes folder to prevent
  // default remix convention from picking up routes
  ignoredRouteFiles: ['**/*'],
  routes: async defineRoutes => {
    return flatRoutes('routes', defineRoutes)
  },
}
```

### API

```ts
function flatRoutes(
  routeDir: string | string[],
  defineRoutes: DefineRoutesFunction,
  options: FlatRoutesOptions,
)

type FlatRoutesOptions = {
  appDir?: string // optional app directory (defaults to app)
  basePath?: string // optional base path (default is '/')
  paramPrefixChar?: string // optional param prefix (default is '$')
  ignoredRouteFiles?: string[] // optional files to ingore as routes (same as Remix config option)
  visitFiles?: VisitFilesFunction // optional visitor (useful for tests to provide files without file system)
}
```

NOTE: `routeDir` should be relative to the `app` folder. If you want to use the `routes` folder, you will need to update the `ignoredRouteFiles` property to ignore **all** files: `**/*`

## 🔨 Flat Routes Convention

### Example (flat-files)

```
routes/
  _auth.forgot-password.tsx
  _auth.login.tsx
  _auth.reset-password.tsx
  _auth.signup.tsx
  _auth.tsx
  _landing.about.tsx
  _landing.index.tsx
  _landing.tsx
  app.calendar.$day.tsx
  app.calendar.index.tsx
  app.calendar.tsx
  app.projects.$id.tsx
  app.projects.tsx
  app.tsx
  app_.projects.$id.roadmap.tsx
  app_.projects.$id.roadmap[.pdf].tsx
```

As React Router routes:

```jsx
<Routes>
  <Route element={<Auth />}>
    <Route path="forgot-password" element={<Forgot />} />
    <Route path="login" element={<Login />} />
    <Route path="reset-password" element={<Reset />} />
    <Route path="signup" element={<Signup />} />
  </Route>
  <Route element={<Landing />}>
    <Route path="about" element={<About />} />
    <Route index element={<Index />} />
  </Route>
  <Route path="app" element={<App />}>
    <Route path="calendar" element={<Calendar />}>
      <Route path=":day" element={<Day />} />
      <Route index element={<CalendarIndex />} />
    </Route>
    <Route path="projects" element={<Projects />}>
      <Route path=":id" element={<Project />} />
    </Route>
  </Route>
  <Route path="app/projects/:id/roadmap" element={<Roadmap />} />
  <Route path="app/projects/:id/roadmap.pdf" />
</Routes>
```

Individual explanations:

| filename                              | url                             | nests inside of...   |
| ------------------------------------- | ------------------------------- | -------------------- |
| `_auth.forgot-password.tsx`           | `/forgot-password`              | `_auth.tsx`          |
| `_auth.login.tsx`                     | `/login`                        | `_auth.tsx`          |
| `_auth.reset-password.tsx`            | `/reset-password`               | `_auth.tsx`          |
| `_auth.signup.tsx`                    | `/signup`                       | `_auth.tsx`          |
| `_auth.tsx`                           | n/a                             | `root.tsx`           |
| `_landing.about.tsx`                  | `/about`                        | `_landing.tsx`       |
| `_landing.index.tsx`                  | `/`                             | `_landing.tsx`       |
| `_landing.tsx`                        | n/a                             | `root.tsx`           |
| `app.calendar.$day.tsx`               | `/app/calendar/:day`            | `app.calendar.tsx`   |
| `app.calendar.index.tsx`              | `/app/calendar`                 | `app.calendar.tsx`   |
| `app.projects.$id.tsx`                | `/app/projects/:id`             | `app.projects.tsx`   |
| `app.projects.tsx`                    | `/app/projects`                 | `app.tsx`            |
| `app.tsx`                             | `/app`                          | `root.tsx`           |
| `app_.projects.$id.roadmap.tsx`       | `/app/projects/:id/roadmap`     | `root.tsx`           |
| `app_.projects.$id.roadmap[.pdf].tsx` | `/app/projects/:id/roadmap.pdf` | n/a (resource route) |

## Nested Layouts

### Default match

By default, `flat-routes` will nest the current route into the parent layout that has the longest matching prefix.

Given the layout route `app.calendar.tsx`, the following routes will be nested under `app.calendar.tsx` since **`app.calendar`** is the longest matching prefix.

- `app.calendar.index.tsx`
- `app.calendar.$day.tsx`

### Override match

Sometimes you want to use a parent layout that is higher up in the route hierarchy. With the default Remix convention, you would use dot (`.`) notation instead of nested folders. With `flat-routes`, since routes files always use dots, there is a different convention to specify which layout to nest under.

Let's say you have an `app.tsx` layout, and you have a route that you don't want to share with the layout, but instead want to match with `root.tsx`. To override the default parent match, append a trailing underscore (`_`) to the segment that is the immediate child of the route you want to nest under.

`app_.projects.$id.roadmap.tsx` will nest under `root` since there are no matching routes:

- ❌ `app_.projects.$id.tsx`
- ❌ `app_.projects.tsx`
- ❌ `app_.tsx`
- ✅ `root.tsx`

## Conventions

| filename                        | convention             | behavior                        |
| ------------------------------- | ---------------------- | ------------------------------- |
| `privacy.jsx`                   | filename               | normal route                    |
| `pages.tos.jsx`                 | dot with no layout     | normal route, `.` -> `/`        |
| `about.jsx`                     | filename with children | parent layout route             |
| `about.contact.jsx`             | dot                    | child route of layout           |
| `about.index.jsx`               | index filename         | index route of layout           |
| `about._index.jsx`              | alias of index.tsx     | index route of layout\*         |
| `about_.company.jsx`            | trailing underscore    | url segment, no layout          |
| `app_.projects.$id.roadmap.tsx` | trailing underscore    | change default parent layout    |
| `_auth.jsx`                     | leading underscore     | layout nesting, no url segment  |
| `_auth.login.jsx`               | leading underscore     | child of pathless layout route  |
| `users.$userId.jsx`             | leading $              | URL param                       |
| `docs.$.jsx`                    | bare $                 | splat route                     |
| `dashboard.route.jsx`           | route suffix           | optional, ignored completely    |
| `investors/[index].jsx`         | brackets               | escapes conventional characters |

> NOTE: The underscore prefix for the index route is optional but helps sort the file to the top of the directory listing.

## Justification

- **Make it easier to see the routes your app has defined** - just pop open "routes/" and they are all right there. Since file systems typically sort folders first, when you have dozens of routes it's hard to see today which folders have layouts and which don't. Now all related routes are sorted together.

- **Decrease refactor/redesign friction** - while code editors are pretty good at fixing up imports when you move files around, and Remix has the `"~"` import alias, it's just generally easier to refactor a code base that doesn't have a bunch of nested folders. Remix will no longer force this.

  Additionally, when redesigning the user interface, it's simpler to adjust the names of files rather than creating/deleting folders and moving routes around to change the way they nest.

- **Help apps migrate to Remix** - Existing apps typically don't have a nested route folder structure like today's conventions. Moving to Remix is arduous because you have to deal with all of the imports.

## Colocation

While the example is exclusively files, they are really just "import paths". So you could make a folder for a route instead and the `index` file will be imported, allowing all of a route's modules to live alongside each other. This is the _flat-folders_ convention, as opposed to the _flat-files_ convention detailed above.

### Example (flat-folders)

```
routes/
  _auth.forgot-password.tsx
  _auth.login.tsx
  _auth.tsx
  _landing.about.tsx
  _landing.index.tsx
  _landing.tsx
  app.projects.tsx
  app.projects.$id.tsx
  app.tsx
  app_.projects.$id.roadmap.tsx
```

Each route becomes a folder with the route name minus the file extension. The route file then is named _index.tsx_.

So _app.projects.tsx_ becomes _app.projects/index.tsx_

```
routes/
  _auth/
    index.tsx x <- route file (same as _auth.tsx)
  _auth.forgot-password/
    index.tsx  <- route file (same as _auth.forgot-password.tsx)
  _auth.login/
    index.tsx   <- route files (same as _auth.login.tsx)
  _landing.about/
    index.tsx   <- route file (same as _landing.about.tsx)
    employee-profile-card.tsx
    get-employee-data.server.tsx
    team-photo.jpg
  _landing.index/
    index.tsx   <- route file (same as _landing.index.tsx)
    scroll-experience.tsx
  _landing/
    index.tsx   <- route file (same as _landing.tsx)
    header.tsx
    footer.tsx
  app/
    index.tsx   <- route file (same as app.tsx)
    primary-nav.tsx
    footer.tsx
  app_.projects.$id.roadmap/
    index.tsx   <- route file (same as app_.projects.$id.roadmap.tsx)
    chart.tsx
    update-timeline.server.tsx
  app.projects/
    index.tsx <- layout file (sames as app.projects.tsx)
    project-card.tsx
    get-projects.server.tsx
    project-buttons.tsx
  app.projects.$id/
    index.tsx  <- route file (sames as app.projects.$id.tsx)
```

### Aliases

Since the route file is now named _index.tsx_ and you can colocate additional files in the same route folder, the _index.tsx_ file may get lost in the list of files. You can also use the following aliases for _index.tsx_. The underscore prefix will sort the file to the top of the directory listing.

- `_index.tsx`
- `_layout.tsx`
- `_route.tsx`

> NOTE: The _\_layout.tsx_ and _\_route.tsx_ files are simply more explicit about their role. They work the same as _index.tsx_.

As with flat files, an index route (not to be confused with index route _file_), can also use the underscore prefix. The route `_landing.index` can be saved as `_landing.index/index.tsx` or `_landing._index/_index.tsx`.

This is a bit more opinionated, but I think it's ultimately what most developers would prefer. Each route becomes its own "mini app" with all of its dependencies together. With the `ignoredRouteFiles` option it's completely unclear which files are routes and which aren't.

## 🚚 Migrating Existing Routes

You can now migrate your existing routes to the new `flat-routes` convention. Simply run:

```bash
npx migrate-flat-routes <sourceDir> <targetDir> [options]

Example:
  npx migrate-flat-routes ./app/routes ./app/flatroutes --convention=flat-folders

NOTE:
  sourceDir and targetDir are relative to project root

Options:
  --convention=<convention>
    The convention to use when migrating.
      flat-files - Migrates to flat files
      flat-folders - Migrates to flat directories with route.tsx files
      hybrid - Keep folder structure with '+' suffix and _layout files
  --force
    Overwrite target directory if it exists
```

## 😍 Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://kiliman.dev/"><img src="https://avatars.githubusercontent.com/u/47168?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kiliman</b></sub></a><br /><a href="https://github.com/kiliman/remix-mount-routes/commits?author=kiliman" title="Code">💻</a> <a href="https://github.com/kiliman/remix-mount-routes/commits?author=kiliman" title="Documentation">📖</a></td>
    <td align="center"><a href="http://remix.run/"><img src="https://avatars.githubusercontent.com/u/100200?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ryan Florence</b></sub></a><br /><a href="https://github.com/kiliman/remix-mount-routes/commits?author=ryanflorence" title="Documentation">📖</a></td>
    <td align="center"><a href="https://blp.is/"><img src="https://avatars.githubusercontent.com/u/967145?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Brandon Pittman</b></sub></a><br /><a href="https://github.com/kiliman/remix-mount-routes/commits?author=brandonpittman" title="Documentation">📖</a> <a href="https://github.com/kiliman/remix-mount-routes/commits?author=brandonpittman" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/machour"><img src="https://avatars.githubusercontent.com/u/304450?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Mehdi Achour</b></sub></a><br /><a href="https://github.com/kiliman/remix-mount-routes/commits?author=machour" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/falegh"><img src="https://avatars.githubusercontent.com/u/49175237?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Fidel González</b></sub></a><br /><a href="https://github.com/kiliman/remix-mount-routes/commits?author=falegh" title="Documentation">📖</a></td>
    <td align="center"><a href="https://www.linkedin.com/in/andrewihaines"><img src="https://avatars.githubusercontent.com/u/785641?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Andrew Haines</b></sub></a><br /><a href="https://github.com/kiliman/remix-mount-routes/commits?author=haines" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/wonu"><img src="https://avatars.githubusercontent.com/u/9602236?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Wonu Lee</b></sub></a><br /><a href="https://github.com/kiliman/remix-mount-routes/commits?author=wonu" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://about.me/knisterpeter"><img src="https://avatars.githubusercontent.com/u/327445?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Markus Wolf</b></sub></a><br /><a href="https://github.com/kiliman/remix-mount-routes/commits?author=KnisterPeter" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/sarat1669"><img src="https://avatars.githubusercontent.com/u/11179580?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Sarat Chandra Balla</b></sub></a><br /><a href="https://github.com/kiliman/remix-mount-routes/commits?author=sarat1669" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
