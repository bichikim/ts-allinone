const moduleAlias = require('module-alias')
const {resolve} = require('path')
const {register} = require('ts-node')
require('reflect-metadata')

const TEST_TS_CONFIG_FILE_NAME = 'tsconfig.json'

moduleAlias.addAlias('~', resolve(process.cwd(), 'src'))
moduleAlias.addAlias('@', resolve(process.cwd(), 'src'))
moduleAlias(process.cwd())
register({project: TEST_TS_CONFIG_FILE_NAME})
