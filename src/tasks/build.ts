import del from 'del'
import {dest, src} from 'gulp'
import {series} from 'gulp'
import ts from 'gulp-typescript'
import {defaultVal, ITsAIOOptions} from '../'
import tsPathResolve from '../ts-path-resolve'

export const clean = () => () => {
  return del(['dist/**'])
}

export const compile = (options: Partial<ITsAIOOptions>) => (done) => {
  const {project = defaultVal.project, include = defaultVal.include} = options
  const tsProject: any = ts.createProject(project, {
    declaration: true,
    module: 'UMD',
  })
  src(include)
    .pipe(tsPathResolve(tsProject.config))
    .pipe(tsProject())
    .pipe(dest('dist'))
    .on('end', () => {
      done()
    })
}

export const build = (options: ITsAIOOptions) => {
  return series(clean(), compile(options))
}
