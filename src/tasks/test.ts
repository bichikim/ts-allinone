import shell from 'gulp-shell'
import path from 'path'
import {ITsAIOOptions} from '../'
const DEFAULT_INCLUDE = ['test/**/*.spec.ts']

interface ITestOptions {
  ync?: boolean
  watch?: boolean
}

export const test = (options: ITsAIOOptions, testOptions: ITestOptions = {}) => {
  const {ync = false, watch = false} = testOptions
  const {include = DEFAULT_INCLUDE, moduleRoot} = options
  const forOptions = (deco: string, list: string[] | string): string[] => {
    const create = (value: string): string => `--${deco} "${value}"`
    if(typeof list === 'string'){
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

  if(ync){
    command.push('nyc')
  }

  const {requires = [path.join(moduleRoot, 'register/mocha.js')]} = options
  command.push('mocha', forOptions('require', requires).join(' '))
  if(watch){
    command.push('--watch', '--watch-extensions ts')
  }
  command.push(include.join(' '))

  return shell.task(command.join(' '))
}

export const coverage = (options: ITsAIOOptions) => {
  return test(options, {ync: true})
}

export const testWatch = (options: ITsAIOOptions) => {
  return test(options, {watch: true})
}
