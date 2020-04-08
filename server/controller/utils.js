const path = require('path')
// const pubPath = path.resolve(__dirname, '../public')
const { execSync, spawn } = require('child_process')

const handle = {
  unzip (file, dir) {
    execSync(`unzip -o ${file} -d ${dir}`)
  },
  rm (file) {
    execSync(`rm -rf ${file}`)
  },
  spawn (cmd, option) {
    return new Promise((resolve, reject) => {
      const handle = spawn(cmd, option)
      handle.stdout.setEncoding('utf8')
      handle.stdout.on('data', (data) => {
        console.log(`${cmd} stdout: \n${data}`)
      })
      handle.stderr.setEncoding('utf8')
      handle.stderr.on('data', (data) => {
        console.error(`${cmd} stderr: \n${data}`)
      })
      handle.on('close', (code) => {
        if (code === 0) {
          resolve()
        } else {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject()
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
  }
}

module.exports = handle
