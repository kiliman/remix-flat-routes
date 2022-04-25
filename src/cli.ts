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

  let options: MigrateOptions = { convention: 'flat-files' }

  for (let option of argv.slice(2)) {
    if (option.startsWith('--convention=')) {
      let convention = option.substring('--convention='.length)
      if (convention === 'flat-files' || convention === 'flat-folders') {
        options.convention = convention
      } else {
        usage()
      }
    } else {
      usage()
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
      flat-files - Migrates all files to a flat directory structure.
      flat-folders - Migrates all files to a flat directory structure, but
        creates folders for each route.
`,
  )
}
