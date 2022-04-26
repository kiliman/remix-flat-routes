import * as fs from 'fs'
import * as path from 'path'
import type { VisitFilesFunction } from './index'

export const visitFiles: VisitFilesFunction = (
  dir: string,
  visitor: (file: string) => void,
  baseDir = dir,
) => {
  for (let filename of fs.readdirSync(dir)) {
    let file = path.resolve(dir, filename)
    let stat = fs.lstatSync(file)

    if (stat.isDirectory()) {
      visitFiles(file, visitor, baseDir)
    } else if (stat.isFile()) {
      visitor(path.relative(baseDir, file))
    }
  }
}
