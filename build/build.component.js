const { request } = require('http')
const { execSync } = require('child_process')
const fs = require('fs-extra')
const [,, dir] = process.argv

if (!dir) {
  console.log('请输入组件名')
  process.exit(0)
}

console.log('打包中...')
execSync(
  `./node_modules/.bin/vue-cli-service build --target lib --name bf-${dir} src/components/basic-components/${dir}/index.ts`
)

console.log('处理...')
fs.copySync(`./dist/bf-${dir}.umd.min.js`, `./server/public/basic/${dir}/index.js`)
const existCss = fs.pathExistsSync(`./dist/bf-${dir}.css`)
if (existCss) {
  fs.copySync(`./dist/bf-${dir}.css`, `./server/public/basic/${dir}/index.css`)
}
fs.outputJSON(`./server/public/basic/${dir}/data.json`, {
  name: `bf-${dir}`,
  existCss
})

console.log('更新组件列表')
const req = request({
  hostname: 'localhost',
  port: 3000,
  path: '/butterfly/component/basic',
  method: 'POST'
}, (res) => {
  res.setEncoding('utf8')
  res.on('data', (chunk) => {
    console.log(`${chunk}`)
  })
  res.on('end', () => {
    console.log('处理完成')
  })
})
// execSync('curl -X POST http://localhost:3000/butterfly/component/basic')
req.end()
