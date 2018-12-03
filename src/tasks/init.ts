import {copyFile, existsSync} from 'fs-extra'
import path from 'path'
import {ITsAIOOptions} from '../'
const FILE_LIST = ['.eslintrc.js', '.nycrc', '.prettierrc', 'tsconfig.json', 'tslint.json']

export const init = (options: ITsAIOOptions) => {
  const {moduleRoot, projectRoot} = options
  // .nycrc .eslintrc.js .prettierrc tsconfig.json tslint.json 파일을 프로젝트 폴더에 복제한다.
  return async () => {
    const copyTask: Array<Promise<void>> = []
    FILE_LIST.forEach((value) => {
      const projectFilePath = path.join(projectRoot, value)
      const exist = existsSync(projectFilePath)
      if(!exist){
        // @ts-ignore
        copyTask.push(copyFile(path.join(moduleRoot, value), projectFilePath))
      }
    })
    return Promise.all(copyTask)
  }
}
