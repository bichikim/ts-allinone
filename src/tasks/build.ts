import del from 'del'
import {dest, series, src, symlink} from 'gulp'
import ts from 'gulp-typescript'
import {join} from 'path'
import {ITsAIOOptions} from '../'
import tsPathResolve from '../ts-path-resolve'
const DEFAULT_INCLUDE = ['src/**/*.ts']
const DEFAULT_BUILD_DIR = 'dist'
const DEFAULT_TS_CONFIG = 'tsconfig.json'

export const clean = (options: ITsAIOOptions) => () => {
  const {buildDir = DEFAULT_BUILD_DIR} = options
  return del([`${buildDir}/**`])
}

export const compile = (options: ITsAIOOptions) => (done) => {
  const {
    tsConfig = DEFAULT_TS_CONFIG,
    include = DEFAULT_INCLUDE,
    buildDir = DEFAULT_BUILD_DIR,
    projectRoot,
  } = options
  if(include.length < 1){
    include.push(...DEFAULT_INCLUDE)
  }
  if(!projectRoot){
    throw new Error('compile: no projectRoot')
  }
  const tsProject: any = ts.createProject(join(projectRoot, tsConfig), {
    declaration: true,
    module: 'UMD',
  })
  src(include)
    .pipe(tsPathResolve(tsProject.config))
    .pipe(tsProject())
    .pipe(dest(buildDir))
    .on('end', () => {
      done()
    })
}

export const build = (options: ITsAIOOptions) => {
  return series(clean(options), compile(options))
}
