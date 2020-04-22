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
      _transform(project.constant).then(cons => {
        project.constant = cons
      })
    ]
    if (project.utils) {
      transArr.push(_transform(project.utils).then(utils => {
        project.utils = utils
      }))
    }
    project.pages.forEach((page, i) => {
      // page.state
      transArr.push(_transform(page.state).then(state => {
        page.state = state
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
  }
}

module.exports = handle
