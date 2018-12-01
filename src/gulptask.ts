import del from 'del'
import {dest, series, src} from 'gulp'
import shell from 'gulp-shell'
import ts from 'gulp-typescript'
import {forEach} from 'lodash'
import path from 'path'
import {ITsAIOOptions} from './'
import tsPathResolve from './ts-path-resolve'

interface ITestOptions {
  ync?: boolean,
  watch?: boolean,
}

const defaultVal: ITsAIOOptions = {
  project: 'tsconfig.json',
  buildDir: 'dist',
  include: ['src/**/*.ts', 'src/**/*.js'],
  requires: [],
}

export const clean = () => (done) => {
  return del(['dist/**'], done)
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

export const build = (options: Partial<ITsAIOOptions> = {}) => {
  return series(
    clean(),
    compile(options),
  )
}

export const coverage = (options: Partial<ITsAIOOptions> = {}) => {
  return test(options, {ync: true})
}

export const testWatch = (options: Partial<ITsAIOOptions> = {}) => {
  return test(options, {watch: true})
}

export const test = (options: Partial<ITsAIOOptions> = {}, testOptions: ITestOptions = {}) => {
  const {ync = false, watch = false} = testOptions
  const forOptions = (deco: string, list: string[] | string): string[] => {
    const create = (value: string): string => (`--${deco} "${value}"`)
    if(typeof list === 'string'){
      return [create(list)]
    }
    return list.map((value: string) => {
      return create(value)
    })
  }

  const {include = ['test/**/*.spec.ts']} = options

  // project path
  const projectRoot = process.cwd()

  // this file path
  const sourcePath = __dirname
  // ts-node register path
  const tsNodeRegister = path.join(projectRoot, 'node_modules', 'ts-node/register')

  // __INNER true meaning is internal running by ts-node
  let isInner: any = process.env.__INNER
  isInner = isInner === 'true' || isInner === true

  // inner running use .ts
  // mocha register file path
  const mochaRegister = path.join(sourcePath, isInner ? 'mocha.ts' : 'mocha.js')

  const command: string[] = []
  if(ync){
    const yncOptions = {
      require: [tsNodeRegister, mochaRegister],
      extension: ['.ts', '.tsx'],
      include: ['src/**/*'],
      exclude: ['**/*.d.ts'],
      reporter: ['text-summary', 'lcov'],
      all: 'true',
    }
    const nycOptionsStringList: string[] = []
    forEach(yncOptions, (value, key) => {
      nycOptionsStringList.push(forOptions(key, value).join(' '))
    })
    command.push(
      'nyc',
      ...nycOptionsStringList,
    )
  }

  const {requires = [tsNodeRegister, mochaRegister]} = options
  command.push(
    'mocha',
    forOptions('require', requires).join(' '),
  )
  if(watch){
    command.push(
      '--watch',
      '--watch-extensions ts',
    )
  }
  command.push(
    include.join(' '),
  )

  return shell.task(command.join(' '))
}
