import shell from 'gulp-shell'
import path from 'path'
import {defaultVal, ITsAIOOptions} from '../'

interface ITestOptions {
  ync?: boolean
  watch?: boolean
}

export const test = (options: ITsAIOOptions, testOptions: ITestOptions = {}) => {
  const {
    ync = false,
    watch = false,
  } = testOptions
  const {
    include = ['test/**/*.spec.ts'],
    inner = defaultVal.inner,
    projectRoot,
    sourcePath,
  } = options
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
  if(ync){
    command.push('nyc')
  }

  // ts-node register path
  const tsNodeRegister = path.join(projectRoot, 'node_modules', 'ts-node/register')

  // inner running use .ts
  // mocha register file path
  const mochaRegister = path.join(sourcePath, inner ? 'mocha.ts' : 'mocha.js')

  const {requires = [tsNodeRegister, mochaRegister]} = options
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
