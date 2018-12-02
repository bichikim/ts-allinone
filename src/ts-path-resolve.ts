import through from 'through2'
import replacePath from './replace-path'

export default function tsPathResolve(config: {compilerOptions?: any} = {}) {
  const {compilerOptions = {}} = config
  return through.obj(function(this: any, file, enc, cb) {
    if(!file.contents){
      return
    }
    let code = file.contents.toString('utf8')
    code = replacePath(code, file.history.toString(), compilerOptions)
    file.contents = Buffer.from(code)
    this.push(file)
    cb()
  })
}
