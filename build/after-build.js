const fs = require('fs-extra')
const path = require('path')
const { execSync } = require('child_process')

console.log('====> 打包完成，拷贝到 butterfly 工程提交')

// js / css 清单文件，因为发布系统里文件是增量的，不会删除
const manifest = {
  js: [],
  css: []
}
const distJsDir = path.join(__dirname, '../dist-system', 'js')
const distCssDir = path.join(__dirname, '../dist-system', 'css')
fs.readdirSync(distJsDir).forEach(name => {
  manifest.js.push(name)
})
fs.readdirSync(distCssDir).forEach(name => {
  manifest.css.push(name)
})
fs.outputFileSync(path.join(__dirname, '../dist-system', 'manifest.json'), JSON.stringify(manifest))

const target = path.resolve(__dirname, '../../../shinemo/butterfly')
execSync(`rm -rf ${path.join(target, 'dist-system')}`)
fs.copySync(path.resolve(__dirname, `../dist-system`), path.join(target, 'dist-system'))
// 不能直接覆盖 server/public
const copyDirs = [
  'build',
  'server/controller',
  'server/router',
  'server/public/upload',
  'server/public/upload-entry-template.tpl',
  'server/index.js',
  'server/backup.sh',
  'server/config.js',
  'pm2.json',
  'pm2-pro.json',
  'publish.sh',
  'publish-pro.sh',
  'package-lock.json'
  // '.gitignore'
]
const delDirs = [
  'server/public/upload/index.json',
]
copyDirs.forEach(item => {
  fs.copySync(path.resolve(__dirname, `../`, item), path.join(target, item))
})
delDirs.forEach(item => {
  execSync(`rm -rf ${path.join(target, item)}`)
})
const json = fs.readJsonSync(path.resolve(__dirname, `../package.json`))
delete json.dependencies['@xm/native']
fs.outputFileSync(path.join(target, 'package.json'), JSON.stringify(json, null, 2))

let noPush = false
try {
  execSync('git add . && git commit -m fix:system', {
    cwd: target,
    encoding: 'utf8'
  })
} catch (e) {
  if (/working tree clean/.test(e.stdout)) {
    console.log('====> 无变化，不需要提交')
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
