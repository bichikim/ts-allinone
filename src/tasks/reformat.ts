import {series} from 'gulp'
import shell from 'gulp-shell'
import {ITsAIOOptions} from '../'
const DEFAULT_INCLUDE = ['"src/**/*.ts"']

export const prettier = (options: ITsAIOOptions) => {
  const {include = []} = options
  if(include.length < 1){
    include.push(...DEFAULT_INCLUDE)
  }
  const command = ['prettier-eslint', '--write', ...include]
  return shell.task(command.join(' '))
}

export const reformat = (options: ITsAIOOptions) => {
  return series(fixTsLint(options), fixEsLint(options), prettier(options))
}

export const fixTsLint = (options: ITsAIOOptions) => {
  const {include = []} = options
  if(include.length < 1){
    include.push(...DEFAULT_INCLUDE)
  }
  const command = ['tslint', '--fix', ...include]
  return shell.task(command.join(' '))
}

export const fixEsLint = (options: ITsAIOOptions) => {
  const {include = []} = options
  if(include.length < 1){
    include.push(...DEFAULT_INCLUDE)
  }
  const command = ['eslint', '--fix', ...include]
  return shell.task(command.join(' '))
}
