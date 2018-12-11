#!/usr/bin/env node
import commander from 'commander'
import {indexOf, pick} from 'lodash'
import {camelCase} from 'lodash'
import path from 'path'
import * as tasks from './tasks'

const DEFAULT_COMMAND = 'build'

export interface ITsAIOOptions {
  tsConfig?: string
  buildDir?: string
  requires?: string[]
  include?: string[]
  test?: string[]
  inner?: boolean
  moduleRoot?: string
  projectRoot?: string
  sourcePath?: string
}

function collect(value, list: any[]) {
  list.push(value)
  return list
}

class Command {
  get chosen(): string | undefined {
    return this._chosen
  }

  private static _tabbedConsole(message: string, step: number = 1) {
    let tab = ''
    for(let i = step; i > 0; i -= 1){
      tab += '  '
    }
    // eslint-disable-next-line
    console.log(`${tab}${message}`)
  }

  private readonly _commands: string[]
  private _chosen?: string
  private readonly _name: string

  constructor(commands: string[], options: {default?: string; name?: string} = {}) {
    const {default: df, name = 'Commands'} = options
    this._commands = commands
    this._chosen = df
    this._name = name
  }

  action(command?: string) {
    if(command && indexOf(this._commands, command) < 0){
      // eslint-disable-next-line
      console.log(`> "${command}" is not a supporting command please refer to bellow`)
      this.onHelp()
      process.exit(1)
    }

    if(command){
      this._chosen = command
    }
  }

  onHelp(): void {
    // eslint-disable-next-line
    console.log('')
    // eslint-disable-next-line
    console.log(`${this._name}:`)
    this._commands.forEach((value) => {
      Command._tabbedConsole(value)
    })
    // eslint-disable-next-line
    console.log('')
  }
}

const command = new Command(['build', 'test', 'test-watch', 'coverage', 'reformat'], {
  default: DEFAULT_COMMAND,
})

commander
  .arguments('[command]')
  .action((cmd) => {
    command.action(cmd)
  })
  .option('-c, --ts-config [dir]', 'set a project directory', 'tsconfig.json')
  .option('-d, --build-dir [dir]', 'set a directory for built result files', 'dist')
  .option('-i, --include [regex]', 'source directories (collect able)', collect, [])
  .option('-t, --test [regex]', 'test directories(collect able, test only)', collect, [])
  .option('-r, --requires [file path]', 'require files (collect able)', collect, [])
  .on('--help', () => {
    command.onHelp()
  })
  .parse(process.argv)

const options: Partial<ITsAIOOptions> = pick(commander, [
  'tsConfig',
  'buildDir',
  'include',
  'requires',
  'test',
])

options.projectRoot = process.cwd()
options.moduleRoot = path.resolve(__dirname, '../')
options.sourcePath = __dirname
options.inner = options.projectRoot === options.moduleRoot

if(command.chosen){
  // eslint-disable-next-line
  console.log(`> ${command.chosen}`)
}

if(options.inner){
  // eslint-disable-next-line
  console.log('> This is running for developing ts-all-in-one project mode')
  // eslint-disable-next-line
  console.log('options.projectRoot: ', options.projectRoot)
  // eslint-disable-next-line
  console.log('options.moduleRoot: ', options.moduleRoot)
  // eslint-disable-next-line
  console.log('options.sourcePath: ', options.sourcePath)
  // eslint-disable-next-line
  console.log('options.tsConfig: ', options.tsConfig)
  // eslint-disable-next-line
  console.log('options.buildDir: ', options.buildDir)
  // eslint-disable-next-line
  console.log('options.include: ', options.include)
  // eslint-disable-next-line
  console.log('options.requires: ', options.requires)
  // eslint-disable-next-line
  console.log('options.test: ', options.test)
}

tasks[camelCase(command.chosen)](options)((error) => {
  if(error){
    throw error
  }
  // eslint-disable-next-line
  console.log('done')
})
