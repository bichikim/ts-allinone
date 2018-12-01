import moduleAlias from 'module-alias'
import {resolve} from 'path'
import 'reflect-metadata'
// import tsNode from 'ts-node'

// console.log(process.cwd())

// const TEST_TS_CONFIG_FILE_NAME = 'tsconfig.test.json'

moduleAlias.addAlias('~', resolve(__dirname, '../src'))
moduleAlias.addAlias('@', resolve(__dirname, '../src'))
moduleAlias(__dirname + '/../')
// tsNode.register({project: TEST_TS_CONFIG_FILE_NAME})
