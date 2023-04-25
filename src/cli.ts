import * as fs from 'fs'
import { migrate, MigrateOptions } from './migrate'

main()

function main() {
  const argv = process.argv.slice(2)
  if (argv.length < 2) {
    printUsageAndExit()
  }
  const sourceDir = argv[0]
  const targetDir = argv[1]

  validateDirectories(sourceDir, targetDir)

  const options = buildOptions(argv.slice(2))

  migrate(sourceDir, targetDir, options)
}

function validateDirectories(sourceDir: string, targetDir: string) {
  if (sourceDir === targetDir) {
    printErrorAndExit('Source and target directories must be different.')
  }

  if (!fs.existsSync(sourceDir)) {
    printErrorAndExit(`Source directory '${sourceDir}' does not exist.`)
  }
}

function buildOptions(args: string[]) {
  let options: MigrateOptions = { convention: 'flat-files' }

  for (let option of args) {
    if (option.startsWith('--convention=')) {
      let convention = option.substring('--convention='.length)
      if (convention === 'flat-files' || convention === 'flat-folders') {
        options.convention = convention
      } else {
        printUsageAndExit()
      }
    } else {
      printUsageAndExit()
    }
  }

  return options
}

function printUsageAndExit() {
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
  process.exit(1)
}

function printErrorAndExit(errorMessage: string) {
  console.error(errorMessage)
  process.exit(1)
}
