import commander from 'commander'
import {pick} from 'lodash'
import * as tasks from './gulptask'

export interface ITsAIOOptions {
  project: string
  buildDir: string
  srcs: string[],
}

commander
  .option('-p, --project-ts-config [dir]', 'set a project directory')
  .option('-d, --build-dir [dir]', 'set a directory for built result files')
  .option('-t, --task [name]', 'kind of task', 'build')
  .option('-s, --src [a, b]', 'source directories')
  .parse(process.argv)

const options: Partial<ITsAIOOptions> = pick(commander, ['project', 'buildDir'])

const taskName = commander.task

tasks[taskName](options)((error) => {
  if(error){
    throw error
  }
  console.log('done')
})
