/* eslint-disable max-depth,null,max-nested-callbacks */
import fs from 'fs'
import {forEach} from 'lodash'
import path from 'path'

export default function replacePath(code, filePath, importOptions) {
  if(!importOptions.paths){
    console.warn('you don\'t have paths')
  }
  const tscPaths: string[] = Object.keys(importOptions.paths)
  const lines = code.split('\n')

  return lines
    .map((line) => {
      let _line = line
      const matches: string[] = []
      const requireMatches = line.match(/require\((['"])(.*)(['"])\)/g)
      const importMatches = line.match(/import (.*)(['"])(.*)(['"])/g)

      Array.prototype.push.apply(matches, requireMatches)
      Array.prototype.push.apply(matches, importMatches)

      if(!matches || matches.length === 0){
        return _line
      }

      // Go through each require statement
      forEach(matches, (match: string) => {
        forEach(tscPaths, (tscpath: string) => {
          // Find required module & check
          // if its path matching what is described in the paths config.
          const requiredModules = match.match(new RegExp(tscpath, 'g'))

          if(requiredModules && requiredModules.length > 0){
            // eslint-disable-next-line no-unused-vars
            forEach(requiredModules, () => {
              // Skip if it resolves to the node_modules folder
              const modulePath = path.resolve('./node_modules/' + tscpath)
              if(fs.existsSync(modulePath)){
                return true
              }
              // Get relative path and replace
              const sourcePath = path.dirname(filePath)

              const targetPath = path.dirname(
                path.resolve(
                  importOptions.rootDir || '',
                  importOptions.baseUrl || '',
                  ...importOptions.paths[tscpath],
                ),
              )
              let relativePath = path.relative(sourcePath, targetPath)
              relativePath = path.join('./', relativePath, '/')
              relativePath = relativePath.replace(/\\/g, '/')
              _line = _line.replace(new RegExp(tscpath, 'g'), relativePath)
            })
          }
        })
      })
      return _line
    })
    .join('\n')
}
