const fs = require('fs-extra')
const path = require('path')
const { execSync } = require('child_process')

console.log('====> 打包完成，拷贝到 butterfly 工程提交')

const target = path.resolve(__dirname, '../../../shinemo-gitlab/butterfly')
fs.copySync(path.resolve(__dirname, `../dist-system`), target)

let noPush = false
try {
  execSync('git add . && git commit -m build:system', {
    cwd: target,
    encoding: 'utf8'
  })
} catch (e) {
  if (/working tree clean/.test(e.stdout)) {
    console.log('====> 打包无变化，不需要提交')
    noPush = true
  }
}

if (!noPush) {
  console.log('====> 提交中...')

  execSync('git push', {
    cwd: target,
    encoding: 'utf8'
  })

  console.log('====> 提交完成')
}
