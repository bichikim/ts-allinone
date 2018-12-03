const moduleAlias = require('module-alias')
const {resolve, join} = require('path')
const {existsSync} = require('fs')
const {register} = require('ts-node')
require('reflect-metadata')

const TEST_TS_CONFIG_FILE_NAME = process.env.TS_CONFIG_FILE || 'tsconfig.json'
const projectRoot = process.cwd()

let configFileName = join(projectRoot, TEST_TS_CONFIG_FILE_NAME)

if(!existsSync(configFileName)){
  configFileName = resolve(__dirname, '..' ,TEST_TS_CONFIG_FILE_NAME)
}

moduleAlias.addAlias('~', resolve(process.cwd(), 'src'))
moduleAlias.addAlias('@', resolve(process.cwd(), 'src'))
moduleAlias(process.cwd())
register({project: configFileName})
