import {existsSync} from 'fs-extra'
import {series} from 'gulp'
import shell from 'gulp-shell'
import {join} from 'path'

import {ITsAIOOptions} from '../'

const DEFAULT_INCLUDE = ['"src/**/*.ts"']
const PRETTIRERRC_NAME = '.prettierrc'
const TSLINT_CONFIG_NAME = 'tslint.json'
const ESLINT_CONFIG_NAME = '.eslintrc.js'

export const prettier = (options: ITsAIOOptions) => {
  const {include = [], inner, projectRoot, moduleRoot} = options
  if(!projectRoot){
    throw new Error('no projectRoot')
  }
  if(!moduleRoot){
    throw new Error('no moduleRoot')
  }
  if(include.length < 1){
    include.push(...DEFAULT_INCLUDE)
  }
  const command = ['prettier-eslint', '--write']

  if(inner || !existsSync(join(projectRoot, PRETTIRERRC_NAME))){
    command.push(
      '--no-semi',
      '--tab-width',
      '2',
      '--single-quote',
      '--no-bracket-spacing',
      '--trailing-comma',
      'all',
    )
  }
  if(!inner && !existsSync(join(projectRoot, ESLINT_CONFIG_NAME))){
    command.push('--eslint-config-path', join(moduleRoot, ESLINT_CONFIG_NAME))
  }
  command.push(...include)
  return shell.task(command.join(' '))
}

export const reformat = (options: ITsAIOOptions) => {
  return series(fixTsLint(options), fixEsLint(options), prettier(options))
}

export const fixTsLint = (options: ITsAIOOptions) => {
  const {include = [], inner, projectRoot, moduleRoot} = options
  if(!projectRoot){
    throw new Error('no projectRoot')
  }
  if(!moduleRoot){
    throw new Error('no moduleRoot')
  }
  if(include.length < 1){
    include.push(...DEFAULT_INCLUDE)
  }
  const command = ['tslint', '--fix']
  if(!inner && !existsSync(join(projectRoot, TSLINT_CONFIG_NAME))){
    command.push('-c', join(moduleRoot, TSLINT_CONFIG_NAME))
  }

  command.push(...include)
  return shell.task(command.join(' '))
}

export const fixEsLint = (options: ITsAIOOptions) => {
  const {include = [], inner, projectRoot, moduleRoot} = options
  if(!projectRoot){
    throw new Error('no projectRoot')
  }
  if(!moduleRoot){
    throw new Error('no moduleRoot')
  }
  if(include.length < 1){
    include.push(...DEFAULT_INCLUDE)
  }
  const command = ['eslint', '--fix']
  if(!inner && !existsSync(join(projectRoot, ESLINT_CONFIG_NAME))){
    command.push('-c', join(moduleRoot, ESLINT_CONFIG_NAME))
  }
  command.push(...include)
  return shell.task(command.join(' '))
}
