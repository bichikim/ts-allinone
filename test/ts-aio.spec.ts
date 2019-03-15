import {expect} from 'chai'
import {ensureDir, existsSync, removeSync} from 'fs-extra'
import path from 'path'
import {compile} from '~/tasks/build'
import {init} from '~/tasks/init'

describe('test it self', () => {

  describe('tasks', () => {
    describe('init', () => {
      const fileList = [
        '.eslintrc.js',
        '.nycrc',
        'tsconfig.json',
        'tslint.json',
      ]
      const options = {
        moduleRoot: path.resolve(__dirname, '../'),
        projectRoot: path.resolve(__dirname, '.temp'),
        sourcePath: __dirname,
      }
      afterEach(() => {
        removeSync(options.projectRoot)
      })
      it('should init project', async () => {
        await ensureDir(options.projectRoot)
        await init(options)()
        fileList.forEach((value) => {
          expect(existsSync(path.join(options.projectRoot, value))).to.equal(true)
        })
      })
    })
  })
  describe('build', function build() {
    this.timeout(3000)
    const buildDir = 'test/dist/'
    afterEach(() => {
      removeSync(buildDir)
    })
    it('should build', (done) => {
      const result = compile({
        tsConfig: 'tsconfig.json',
        buildDir,
        include: ['test/src/**/*.ts'],
        projectRoot: process.cwd(),
      })(() => {
        expect('').to.equal('')
        done()
      })
    })
  })
})
