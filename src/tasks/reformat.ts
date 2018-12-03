import shell from 'gulp-shell'
import {ITsAIOOptions} from '../'
const DEFAULT_INCLUDE = ['src/**/*.ts']

export const reformat = (options: ITsAIOOptions) => {
  const {include = DEFAULT_INCLUDE} = options
  const command = ['prettier-eslint', '--write', ...include]
  return shell.task(command.join(' '))
}
