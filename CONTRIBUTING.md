# Contributing

Thanks for helping out! Issues and pull requests are welcome.

## Development

```sh
npm ci
npm run typecheck
npm test
npm run build
```

The same checks run in GitHub Actions on every pull request, on Node 20, 22 and 24 (`.github/workflows/publish.yml`).

The repo's `.npmrc` sets `min-release-age=3`: npm won't install a package version until it has been public for three days, which guards against hijacked releases. If `npm install` reports `ETARGET` for a version that exists, that's the window. Wait it out, or pick the previous version.

## Releasing (maintainers)

Releases publish to npm from GitHub Actions through [trusted publishing](https://docs.npmjs.com/trusted-publishers), so no npm token is involved and every release carries provenance.

1. On `main`, bump `version` in `package.json` (and `package-lock.json`), add the release to `CHANGELOG.md`, and commit as `chore(release): vX.Y.Z`.
2. Tag and push:
   ```sh
   git tag -a vX.Y.Z -m "Release vX.Y.Z"
   git push origin main vX.Y.Z
   ```
3. The `publish` workflow runs the checks, confirms the tag matches `package.json`, builds, and runs `npm publish`.

The trusted publisher on npmjs.com names the workflow file (`publish.yml`), so renaming that file breaks publishing until the npm setting is updated to match.
