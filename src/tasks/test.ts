import shell from 'gulp-shell'
import {ITsAIOOptions} from '../'
const DEFAULT_INCLUDE = ['test/**/*.spec.ts']

interface ITestOptions {
  nyc?: boolean
  watch?: boolean
}

export const test = (options: ITsAIOOptions, testOptions: ITestOptions = {}) => {
  const {nyc = false, watch = false} = testOptions
  const {include = DEFAULT_INCLUDE, moduleRoot} = options

  // at less it has the DEFAULT_INCLUDE
  if(include.length < 1){
    include.push(...DEFAULT_INCLUDE)
  }

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

  const {requires = []} = options

  console.log(requires)

  requires.push('ts-node/register', 'tsconfig-paths/register')

  if(nyc){
    command.push('nyc')
  }

  command.push('mocha', ...forOptions('require', requires))
  if(watch){
    command.push('--watch', '--watch-extensions ts')
  }
  command.push(...include)
  return shell.task(command.join(' '))
}

export const coverage = (options: ITsAIOOptions) => {
  return test(options, {nyc: true})
}

export const testWatch = (options: ITsAIOOptions) => {
  return test(options, {watch: true})
}
