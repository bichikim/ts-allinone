import shell from 'gulp-shell'
import {ITsAIOOptions} from '../'

export const reformat = (options: ITsAIOOptions) => {
  const {include = ['src/**/*.ts']} = options
  const command = ['prettier-eslint', '--write', ...include]
  return shell.task(command.join(' '))
}
