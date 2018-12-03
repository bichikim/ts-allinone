#!/usr/bin/env node
import commander from 'commander'
import {pick} from 'lodash'
import {camelCase} from 'lodash'
import path from 'path'
import * as tasks from './tasks'

export interface ITsAIOOptions {
  project?: string
  buildDir?: string
  requires?: string[]
  include?: string[]
  inner?: boolean
  moduleRoot: string
  projectRoot: string
  sourcePath: string
}

export const defaultVal: Required<ITsAIOOptions> = {
  project: 'tsconfig.json',
  buildDir: 'dist',
  include: ['src/**/*.ts', 'src/**/*.js'],
  inner: false,
  requires: [],
  moduleRoot: path.resolve(__dirname, '../'),
  projectRoot: process.cwd(),
  sourcePath: __dirname,
}

commander
  .option('-p, --project-ts-config [dir]', 'set a project directory')
  .option('-d, --build-dir [dir]', 'set a directory for built result files')
  .option('-t, --task [name]', 'kind of task', 'build')
  .option('-i, --include [a, b]', 'source directories')
  .option('-r, --requires [a, b]', 'require files')
  .parse(process.argv)

const options: Partial<ITsAIOOptions> = pick(commander, ['project', 'buildDir'])

options.projectRoot = defaultVal.projectRoot
options.moduleRoot = defaultVal.moduleRoot
options.sourcePath = defaultVal.sourcePath
options.inner = options.moduleRoot === options.projectRoot

const taskName = commander.task

if(options.inner){
  console.log('> This is running for developing ts-all-in-one project mode')
}

tasks[camelCase(taskName)](options)((error) => {
  if(error){
    throw error
  }
  console.log('done')
})
