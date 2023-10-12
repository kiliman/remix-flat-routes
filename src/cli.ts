#!/usr/bin/env node

import * as fs from 'fs'
import { migrate, MigrateOptions } from './migrate'

main()

function main() {
  const argv = process.argv.slice(2)
  if (argv.length < 2) {
    usage()
    process.exit(1)
  }
  const sourceDir = argv[0]
  const targetDir = argv[1]

  if (sourceDir === targetDir) {
    console.error('source and target directories must be different')
    process.exit(1)
  }

  if (!fs.existsSync(sourceDir)) {
    console.error(`source directory '${sourceDir}' does not exist`)
    process.exit(1)
  }

  let options: MigrateOptions = { convention: 'flat-files' }

  for (let option of argv.slice(2)) {
    if (option.startsWith('--convention=')) {
      let convention = option.substring('--convention='.length)
      if (
        convention === 'flat-files' ||
        convention === 'flat-folders' ||
        convention === 'hybrid'
      ) {
        options.convention = convention
        console.log({ convention })
      } else {
        usage()
        process.exit(1)
      }
    } else {
      usage()
      process.exit(1)
    }
  }

  migrate(sourceDir, targetDir, options)
}

function usage() {
  console.log(
    `Usage: migrate <sourceDir> <targetDir> [options]

Options:
  --convention=<convention>
    The convention to use when migrating.
      flat-files - Migrates to flat files
      flat-folders - Migrates to flat directories with route.tsx files
      hybrid - Keep folder structure with '+' suffix and _layout files
`,
  )
}
