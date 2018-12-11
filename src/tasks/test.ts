import {existsSync, readJSONSync} from 'fs-extra'
import shell from 'gulp-shell'
import {join} from 'path'
import {ITsAIOOptions} from '../'
const DEFAULT_INCLUDE = ['test/**/*.spec.ts']

const REQUIRES: string[] = ['tsconfig-paths/register', 'ts-node/register']

const nycFileName = '.nycrc'

const mochaOptions = {
  require: REQUIRES,
}

interface ITestOptions {
  nyc?: boolean
  watch?: boolean
}

export const test = (options: ITsAIOOptions, testOptions: ITestOptions = {}) => {
  const {nyc = false, watch = false} = testOptions
  const {include = [], moduleRoot, test = [], requires = [], inner, projectRoot} = options

  const forOptions = (deco: string, list: string[] | string | boolean): string[] => {
    const create = (value: string | boolean): string => {
      if(typeof value === 'boolean'){
        if(value){
          return `--${deco}`
        }
        return ''
      }
      return `--${deco} "${value}"`
    }
    if(typeof list === 'string' || typeof list === 'boolean'){
      return [create(list)]
    }
    return list.map((value: string) => {
      return create(value)
    })
  }
  const command: string[] = []

  if(!moduleRoot){
    throw new Error('test: no moduleRoot')
  }

  if(!projectRoot){
    throw new Error('test: no projectRoot')
  }

  if(requires.length < 1){
    requires.push(...REQUIRES)
  }

  if(test.length < 1) {
    test.push(...DEFAULT_INCLUDE)
  }

  let nycOptions
  if(!inner && existsSync(join(projectRoot, nycFileName))) {
    nycOptions = readJSONSync(join(projectRoot, nycFileName))
  }else{
    nycOptions = readJSONSync(join(moduleRoot, nycFileName))
  }

  if(!nycOptions.require){
    nycOptions.require = requires
  }

  if(!nycOptions.include){
    nycOptions.include = include
  }

  mochaOptions.require.push(...requires)

  if(nyc){
    command.push('nyc')
    Object.keys(nycOptions).forEach((value) => {
      command.push(...forOptions(value, nycOptions[value]))
    })
  }

  command.push('mocha')
  Object.keys(mochaOptions).forEach((value) => {
    command.push(...forOptions(value, mochaOptions[value]))
  })
  if(watch){
    command.push('--watch', '--watch-extensions ts')
  }
  command.push(...test)
  return shell.task(command.join(' '))
}

export const coverage = (options: ITsAIOOptions) => {
  return test(options, {nyc: true})
}

export const testWatch = (options: ITsAIOOptions) => {
  return test(options, {watch: true})
}
