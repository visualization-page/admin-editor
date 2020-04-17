const { request } = require('http')
const { spawn } = require('child_process')
const fs = require('fs-extra')
const path = require('path')
let [,, dir, cli = 'true', entry, type = 'basic'] = process.argv
// eslint-disable-next-line no-eval
cli = eval(cli)
if (!dir) {
  console.log('请输入组件名')
  process.exit(0)
}
entry = entry || path.resolve(__dirname, '../', `src/components/basic-components/${dir}/index.ts`)

console.log('打包中...')
const handle = spawn(
  cli ? './node_modules/.bin/vue-cli-service' : './node_modules/.bin/webpack-cli',
  cli
    ? ['build', '--target', 'lib', '--name', `bf-${dir}`, entry]
    : ['--config', path.resolve(__dirname, './webpack.config.js'), '--mode', 'production'],
  {
    env: {
      ...process.env,
      dir,
      entry
    }
  },
  (err) => {
    if (err) {
      throw err
    }
  }
)

handle.stdout.setEncoding('utf8')
handle.stdout.on('data', (data) => {
  console.log(data)
})

handle.stderr.setEncoding('utf8')
handle.stderr.on('data', (data) => {
  console.error(data)
})

handle.on('close', code => {
  // const replaceString = 'typeof define&&define.amd?define'
  console.log('处理...')
  // const content = fs.readFileSync(`./dist/bf-${dir}.umd.min.js`, 'utf8')
  // const content = fs.readFileSync(`./build/dist/build.js`, 'utf8')
  // fs.writeFileSync(`./server/public/basic/${dir}/index.js`, content.replace(replaceString, 'typeof define_bak&&define_bak.amd?define_bak'), 'utf8')
  cli
    ? fs.copySync(`./dist/bf-${dir}.umd.min.js`, `./server/public/${type}/${dir}/index.js`)
    : fs.copySync(`./dist/build.js`, `./server/public/${type}/${dir}/index.js`)

  const existCss = fs.pathExistsSync(`./dist/bf-${dir}.css`)
  if (existCss) {
    fs.copySync(`./dist/bf-${dir}.css`, `./server/public/${type}/${dir}/index.css`)
  }
  fs.outputJSON(`./server/public/${type}/${dir}/data.json`, {
    name: `bf-${dir}`,
    existCss
  })

  // console.log('更新组件列表')
  // const req = request({
  //   hostname: 'localhost',
  //   port: 9420,
  //   path: `/butterfly/component/${type}`,
  //   method: 'POST'
  // }, (res) => {
  //   res.setEncoding('utf8')
  //   res.on('data', (chunk) => {
  //     console.log(`${chunk}`)
  //   })
  //   res.on('end', () => {
  //     console.log('处理完成')
  //   })
  // })
  // execSync('curl -X POST http://localhost:3000/butterfly/component/basic')
  // req.end()
  console.log('处理完成')
})
