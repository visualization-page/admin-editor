const path = require('path')
const { execSync } = require('child_process')
const babel = require('@babel/core')
const tinify = require('tinify')
const fs = require('fs-extra')
const request = require('request')
const spawn = require('cross-spawn')
// const pubPath = path.resolve(__dirname, '../public')
const isMac = process.platform === 'darwin'
const JSZip = require('jszip')

const handle = {
  doZip (zipName, distDir) {
    return new Promise((resolve, reject) => {
      if (isMac) {
        console.log('🔧 使用 zip 压缩...')
        handle.spawn('zip', ['-qr', `${zipName}.zip`, './'], { cwd: distDir }).then(() => {
          console.log('🔧 zip 压缩完成，处理收尾...')
          resolve()
        }).catch((err) => {
          reject(err)
        })
      } else {
        console.log('🔧 使用 jszip 压缩...')
        const winZip = new JSZip()
        const deepFile = (dir, prefix = '') => {
          for (const f of fs.readdirSync(dir)) {
            // 判断 f 是文件还是文件夹
            const current = path.resolve(dir, f)
            const stat = fs.statSync(current)
            if (stat.isFile()) {
              winZip.file(prefix + f, fs.readFileSync(current))
            } else if (stat.isDirectory()) {
              // 文件夹
              deepFile(path.join(dir, f), prefix + `${f}/`)
            }
          }
        }
        deepFile(distDir)
        winZip
          .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
          .pipe(fs.createWriteStream(path.resolve(distDir, `${zipName}.zip`)))
          .on('finish', function () {
            console.log('🔧 jszip 压缩完成，处理收尾...')
            resolve()
          })
      }
    })
  },

  async zip (zipName, targetDirPath) {
    const name = `${zipName}.zip`
    const zipPath = path.join(targetDirPath, name)
    if (fs.pathExistsSync(zipPath)) {
      handle.rm(zipPath)
    }
    // await handle.spawn('zip', ['-qr', name, './'], { cwd: targetDirPath })
    await handle.doZip(zipName, targetDirPath)
    return path.join(targetDirPath, name)
  },

  unzip (file, dir) {
    execSync(`unzip -o ${file} -d ${dir}`)
  },

  rm (file) {
    execSync(`rm -rf ${file}`)
  },

  spawn (cmd, args, options = {}, logCallback) {
    console.log(cmd, args)
    return new Promise((resolve, reject) => {
      const handle = spawn(cmd, args, options)
      handle.stdout.setEncoding('utf8')
      handle.stdout.on('data', (data) => {
        console.log(`${cmd} stdout: \n${data}`)
        logCallback && logCallback(data)
        if (/working tree clean/.test(data)) {
          reject(data)
        }
      })
      handle.stderr.setEncoding('utf8')
      handle.stderr.on('data', (data) => {
        console.error(`${cmd} stderr: \n${data}`)
        // reject(new Error(data))
        logCallback && logCallback(data)
      })
      handle.on('close', (code) => {
        if (code === 0) {
          resolve()
        } else {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject(new Error(`${cmd} spawn fail !`))
        }
      })
    })
  },

  webpack (dir, entry) {
    console.log('----', `node build/build.component.js ${dir} false ${entry} upload`)
    return handle.spawn('node', [
      path.resolve(__dirname, '../../build/build.component.js'),
      dir,
      false,
      entry,
      'upload'
    ])
  },

  babelTransform (code) {
    return babel.transformAsync(code, {
      root: __dirname,
      envName: 'production',
      presets: [
        [
          '@babel/preset-env',
          {
            targets: 'iOS 8'
            // loose: true
          }
        ]
      ]
      // eslint-disable-next-line no-useless-escape
    }).then(res => res.code.replace('\"use strict\";\n\n', ''))
  },

  babel: async (project) => {
    const _transform = handle.babelTransform
    const dealNode = (node) => {
      // node.style.code
      transArr.push(_transform(node.style.code).then(co => {
        node.style.code = co
      }))
      // node.renderString
      transArr.push(_transform(node.renderString).then(co => {
        node.renderString = co
      }))
      // node.events
      node.events.forEach((nodeEv, l) => {
        transArr.push(_transform(nodeEv.fxCode).then(fx => {
          nodeEv.fxCode = fx
        }))
      })
      node.children.forEach(childNode => {
        dealNode(childNode)
      })
    }
    const transArr = [
      _transform(project.httpOptions.options).then(opt => {
        project.httpOptions.options = opt
      }),
      project.constant ? _transform(project.constant).then(cons => {
        project.constant = cons
      }) : null,
      project.initScripts ? _transform(project.initScripts).then(scrpts => {
        project.initScripts = scrpts
      }) : null,
      project.utils ? _transform(project.utils).then(utils => {
        project.utils = utils
      }) : null
    ].filter(Boolean)
    // if (project.utils) {
    //   transArr.push(_transform(project.utils).then(utils => {
    //     project.utils = utils
    //   }))
    // }
    project.pages.forEach((page, i) => {
      // page.state
      transArr.push(_transform(page.state).then(state => {
        page.state = state
      }))
      // page.methods
      transArr.push(_transform(page.methods).then(methods => {
        page.methods = methods
      }))
      // page.events
      page.events.forEach((ev) => {
        transArr.push(_transform(ev.fxCode).then(fx => {
          ev.fxCode = fx
        }))
      })
      page.nodes.forEach((node) => {
        dealNode(node)
      })
    })

    return Promise.all(transArr).then(() => project)
  },

  tinyfy (sourceData, key) {
    tinify.key = key || 'WmVJzJgLsjcZ3mpyZMzghGtq2FLTWTXY'
    return new Promise((resolve, reject) => {
      tinify.fromBuffer(sourceData).toBuffer(function (err, resultData) {
        if (err instanceof tinify.AccountError) {
          // 更换 key 重试
          const keys = [
            'LsPrH1KLHkZhrcFXZprTqwh2XLdmxQbM',
            'H9pHL9VpJmr69j6RW6wLnBCQGmXjC7qY',
            'wKksxfRTcrSb6v4KzP95JP3kCltC0s7d',
            'LnLzVzgbcg8RGCN8wwTvZ17XtLTV3Pjc',
            'dk1NCB934Q5lMPVd6g4x8mPDtVHtnS9W'
          ]
          const index = Math.floor(Math.random() * keys.length)
          console.log('==== tinyfy 更换 key 重试')
          resolve(handle.tinyfy(sourceData, keys[index]))
        } else if (err) {
          reject(err)
        } else {
          resolve(resultData)
        }
      })
    })
  },

  async downImgAndReplace (str, dest) {
    const destDir = path.join(dest, 'img')
    await fs.ensureDir(destDir)
    function _download (url, filename) {
      const dest = path.join(destDir, filename)
      return new Promise((resolve, reject) => {
        const stream = request(url).pipe(fs.createWriteStream(dest))
        stream.on('finish', () => {
          resolve()
        })
        stream.on('error', () => {
          // eslint-disable-next-line
          reject()
        })
      })
    }

    const urls = []
    str = str.replace(/(https:\/\/global\.uban360\.com.*?)"/g, (all, match) => {
      const key = `%%img${urls.length}%%.png`
      urls.push(match)
      return all.replace(match, `./img/${key}?_=${Date.now()}`)
    })
    await Promise.all(urls.map((x, i) => _download(x, `%%img${i}%%.png`)))
    return str
  }
}

module.exports = handle
