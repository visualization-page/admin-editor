const path = require('path')
// const pubPath = path.resolve(__dirname, '../public')
const { execSync, spawn } = require('child_process')
const babel = require('@babel/core')

const handle = {
  unzip (file, dir) {
    execSync(`unzip -o ${file} -d ${dir}`)
  },
  rm (file) {
    execSync(`rm -rf ${file}`)
  },
  spawn (cmd, args, options = {}) {
    return new Promise((resolve, reject) => {
      const handle = spawn(cmd, args, options)
      handle.stdout.setEncoding('utf8')
      handle.stdout.on('data', (data) => {
        console.log(`${cmd} stdout: \n${data}`)
        if (/working tree clean/.test(data)) {
          reject(data)
        }
      })
      handle.stderr.setEncoding('utf8')
      handle.stderr.on('data', (data) => {
        console.error(`${cmd} stderr: \n${data}`)
        reject(new Error(data))
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
  babel: async (project) => {
    const _transform = (code) => babel.transformAsync(code, {
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

    const transArr = [
      _transform(project.httpOptions.options).then(opt => {
        project.httpOptions.options = opt
      }),
      _transform(project.constant).then(cons => {
        project.constant = cons
      })
    ]
    project.pages.forEach((page, i) => {
      // page.state
      transArr.push(_transform(page.state).then(state => {
        project.pages[i].state = state
      }))
      // page.events
      page.events.forEach((ev, j) => {
        transArr.push(_transform(ev.fxCode).then(fx => {
          project.pages[i].events[j].fxCode = fx
        }))
      })
      page.nodes.forEach((node, k) => {
        // node.style.code
        transArr.push(_transform(node.style.code).then(co => {
          project.pages[i].nodes[k].style.code = co
        }))
        // node.renderString
        transArr.push(_transform(node.renderString).then(co => {
          project.pages[i].nodes[k].renderString = co
        }))
        // node.events
        node.events.forEach((ev, l) => {
          transArr.push(_transform(ev.fxCode).then(fx => {
            project.pages[i].nodes[k].events[l].fxCode = fx
          }))
        })
      })
    })

    return Promise.all(transArr)
  }
}

module.exports = handle
