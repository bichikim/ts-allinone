import del from 'del'
import {dest, series, src} from 'gulp'
import mocha from 'gulp-mocha'
import ts from 'gulp-typescript'
import path from 'path'
import {ITsAIOOptions} from './'
import tsPathResolve from './ts-path-resolve'

const defaultVal: ITsAIOOptions = {
  project: 'tsconfig.json',
  buildDir: 'dist',
  srcs: ['src/**/*.ts', 'src/**/*.js'],
}

const clean = (options: ITsAIOOptions) => (done) => {
  return del(['dist/**'], done)
}

const compile = (options: ITsAIOOptions) => (done) => {
  const {project, srcs} = options
  const tsProject: any = ts.createProject(project, {
    declaration: true,
    module: 'UMD',
  })
  src(srcs)
  .pipe(tsPathResolve(tsProject.config))
  .pipe(tsProject())
  .pipe(dest('dist'))
  .on('end', () => {
    done()
  })
}

export const build = (options: Partial<ITsAIOOptions> = {}) => {
  const {project, buildDir, srcs} = options
  const _options: ITsAIOOptions = {
    project: project || defaultVal.project,
    buildDir: buildDir || defaultVal.buildDir,
    srcs: srcs || defaultVal.srcs,
  }

  return series(
    clean(_options),
    compile(_options),
  )
}

export const test = (options: Partial<ITsAIOOptions> = {}) => {
  const {project, buildDir, srcs} = options
  const _options: ITsAIOOptions = {
    project: project || defaultVal.project,
    buildDir: buildDir || defaultVal.buildDir,
    srcs: srcs || ['test/**/*.spec.ts'],
  }

  return (done) => {
    const projectRoot = process.cwd()
    const sourcePath = __dirname
    const tsNodeRegister = path.join(projectRoot, 'node_modules', 'ts-node/register')
    let isInner: any = process.env.__INNER
    isInner = isInner === 'true' || isInner === true
    const mochaRegister = path.join(sourcePath, isInner ? 'mocha.ts' : 'mocha.js')

    const tsProject: any = ts.createProject(
      _options.project,
      {
        module: 'commonjs',
        target: 'es2015',
      })
    src(_options.srcs)
      .pipe(tsPathResolve(tsProject.config))
      .pipe(mocha({
        require: [tsNodeRegister, mochaRegister],
      }))
  }
}
