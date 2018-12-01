import commander from 'commander'
import {pick} from 'lodash'
import {camelCase} from 'lodash'
import * as tasks from './gulptask'

export interface ITsAIOOptions {
  project: string
  buildDir: string
  requires: string[],
  include: string[],
}

commander
  .option('-p, --project-ts-config [dir]', 'set a project directory')
  .option('-d, --build-dir [dir]', 'set a directory for built result files')
  .option('-t, --task [name]', 'kind of task', 'build')
  .option('-i, --include [a, b]', 'source directories')
  .option('-r, --requires [a, b]', 'require files')
  .parse(process.argv)

const options: Partial<ITsAIOOptions> = pick(commander, ['project', 'buildDir'])

const taskName = commander.task

if(process.env.__INNER === 'true'){
  console.log('> This is running for developing ts-all-in-one project mode')
}

tasks[camelCase(taskName)](options)((error) => {
  if(error){
    throw error
  }
  console.log('done')
})
