#!/usr/bin/env node
import commander from 'commander'
import {camelCase, findIndex, pick, repeat} from 'lodash'
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

interface ICommandItem {
  command: string
  description: string
}

class Command {
  get chosen(): string | undefined {
    return this._chosen
  }

  private readonly _commands: ICommandItem[]
  private _chosen?: string
  private readonly _name: string
  private _maxCommandStringLength?: number

  constructor(commands: ICommandItem[], options: {default?: string; name?: string} = {}) {
    const {default: df, name = 'Commands'} = options
    this._commands = commands
    this._chosen = df
    this._name = name
  }

  action(command?: string) {
    if(command && findIndex(this._commands, {command}) < 0){
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
      this._tabbedConsole(value.command, value.description)
    })
    // eslint-disable-next-line
    console.log('')
  }

  private _getMaxCommandLength(): number {
    if(!this._maxCommandStringLength){
      let maxLength: number = 0
      this._commands.forEach((value) => {
        const {length} = value.command
        if(maxLength < length){
          maxLength = length
        }
      })
      this._maxCommandStringLength = maxLength
    }
    return this._maxCommandStringLength
  }

  private _tabbedConsole(message: string, description?: string, step: number = 1) {
    let tab = repeat(' ', step)
    const willWrite = `${tab}${message}`
    let descriptionTab = repeat(' ', this._getMaxCommandLength() - willWrite.length + step)
    // eslint-disable-next-line
    console.log(`${willWrite}${descriptionTab}   ${description}`)
  }
}

const command = new Command(
  [
    {command: 'build', description: 'build ts to js'},
    {command: 'test', description: 'test codes'},
    {command: 'test-watch', description: 'watch testing codes'},
    {command: 'coverage', description: 'measure test coverage'},
    {command: 'reformat', description: 'format code style'},
    {command: 'init', description: 'copy config files for project'},
  ],
  {
    default: DEFAULT_COMMAND,
  },
)

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
