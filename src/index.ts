#!/usr/bin/env node
import commander from 'commander'
import {pick} from 'lodash'
import {camelCase} from 'lodash'
import path from 'path'
import * as tasks from './tasks'
const DEFAULT_COMMAND = 'build'

export interface ITsAIOOptions {
  tsConfig?: string
  buildDir?: string
  requires?: string[]
  include?: string[]
  inner?: boolean
  moduleRoot?: string
  projectRoot?: string
  sourcePath?: string
}

let command: string | undefined = DEFAULT_COMMAND

commander
  .arguments('[cmd]')
  .action((cmd = DEFAULT_COMMAND) => {
    command = cmd
  })
  .option('-c, --ts-config [dir]', 'set a project directory', 'tsConfig.json')
  .option('-d, --build-dir [dir]', 'set a directory for built result files', 'dist')
  .option('-i, --include [a, b]', 'source directories')
  .option('-r, --requires [a, b]', 'require files')
  .parse(process.argv)

const options: Partial<ITsAIOOptions> = pick(commander, [
  'tsConfig',
  'buildDir',
  'include',
  'requires',
])

options.projectRoot = process.cwd()
options.moduleRoot = path.resolve(__dirname, '../')
options.sourcePath = __dirname
options.inner = options.projectRoot === options.moduleRoot

console.log(`> ${command}`)

if(options.inner){
  console.log('> This is running for developing ts-all-in-one project mode')
  console.log('options.projectRoot: ', options.projectRoot)
  console.log('options.moduleRoot: ', options.moduleRoot)
  console.log('options.sourcePath: ', options.sourcePath)
  console.log('options.tsConfig: ', options.tsConfig)
  console.log('options.buildDir: ', options.buildDir)
  console.log('options.include: ', options.include)
  console.log('options.requires: ', options.requires)
}

tasks[camelCase(command)](options)((error) => {
  if(error){
    throw error
  }
  console.log('done')
})
