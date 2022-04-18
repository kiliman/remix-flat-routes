# Remix Flat Routes

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

This package enables you to define your routes using the flat-routes convention. This is based on the [gist](https://gist.github.com/ryanflorence/0dcc52c2332c2f6e1b52925195f87baf) by Ryan Florence

## 🛠 Installation

```bash
> npm install remix-flat-routes
```

## ⚙️ Configuration

Update your _remix.config.js_ file and use the custom routes config option.

```ts
const { flatRoutes } = require('remix-flat-routes')
module.exports = {
  // ignore all files in routes folder
  ignoredRouteFiles: ['**/*'],
  routes: async defineRoutes => {
    return flatRoutes('routes', defineRoutes)
  },
}
```

NOTE: `basePath` should be relative to the `app` folder. If you want to
use the `routes` folder, you will need to update the `ignoreRouteFiles`
property to ignore **all** files: `**/*`

## 🔨 Flat Routes Convention

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

## Conventions

| filename                | convention             | behavior                        |
| ----------------------- | ---------------------- | ------------------------------- |
| `privacy.jsx`           | filename               | normal route                    |
| `pages.tos.jsx`         | dot with no layout     | normal route, "." -> "/"        |
| `about.jsx`             | filename with children | parent layout route             |
| `about.contact.jsx`     | dot                    | child route of layout           |
| `about.index.jsx`       | index filename         | index route of layout           |
| `about_.company.jsx`    | trailing underscore    | url segment, no layout          |
| `_auth.jsx`             | leading underscore     | layout nesting, no url segment  |
| `_auth.login.jsx`       | leading underscore     | child of pathless layout route  |
| `users.$userId.jsx`     | leading $              | URL param                       |
| `docs.$.jsx`            | bare $                 | splat route                     |
| `dashboard.route.jsx`   | route suffix           | optional, ignored completely    |
| `investors/[index].jsx` | brackets               | escapes conventional characters |

## Justification

- **Make it easier to see the routes your app has defined** - just pop open "routes/" and they are all right there. Since file systems typically sort folders first, when you have dozens of routes it's hard to see which folders have layouts and which don't today. Now all related routes are sorted together.

- **Decrease refactor/redesign friction** - while code editors are pretty good at fixing up imports when you move files around, and Remix has the `"~"` import alias, it's just generally easier to refactor a code base that doesn't have a bunch of nested folders. Remix will no longer force this.

  Additionally, when redesigning the user interface, it's simpler to adjust the names of files rather than creating/deleting folders and moving routes around to change the way they nest.

- **Help apps migrate to Remix** - Existing apps typically don't have a nested route folder structure like today's conventions. Moving to Remix is arduous because you have to deal with all of the imports.

- **Colocation** - while the example is exclusively files, they are really just "import paths". So you could make a folder for a route instead and the `index` file will be imported, allowing all of a route's modules to live along side each other.

For example, these routes:

```
routes/
  _landing.about.tsx
  _landing.index.tsx
  _landing.tsx
  app.projects.tsx
  app.tsx
  app_.projects.$id.roadmap.tsx
```

Could be folders holding their own modules inside:

```
routes/
  _landing.about/
    index.tsx
    employee-profile-card.tsx
    get-employee-data.server.tsx
    team-photo.jpg
  _landing.index/
    index.tsx
    scroll-experience.tsx
  _landing/
    index.tsx
    header.tsx
    footer.tsx
  app.projects/
    project-card.tsx
    get-projects.server.tsx
    project-buttons.tsx
  app/
    index.tsx
    primary-nav.tsx
    footer.tsx
  app_.projects.$id.roadmap/
    index.tsx
    chart.tsx
    update-timeline.server.tsx
```

This is a bit more opinionated, but I think it's ultimately what most developers would prefer. Each route becomes its own "mini app" with all of it's dependencies together. With the routeIgnorePatterns option it's completely unclear which files are routes and which aren't.

## 😍 Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://kiliman.dev/"><img src="https://avatars.githubusercontent.com/u/47168?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kiliman</b></sub></a><br /><a href="https://github.com/kiliman/remix-mount-routes/commits?author=kiliman" title="Code">💻</a> <a href="https://github.com/kiliman/remix-mount-routes/commits?author=kiliman" title="Documentation">📖</a></td>
    <td align="center"><a href="http://remix.run/"><img src="https://avatars.githubusercontent.com/u/100200?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ryan Florence</b></sub></a><br /><a href="https://github.com/kiliman/remix-mount-routes/commits?author=ryanflorence" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
