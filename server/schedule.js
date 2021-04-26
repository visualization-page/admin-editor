const schedule = require('node-schedule')
const path = require('path')
const fs = require('fs-extra')
const gitDir = path.resolve(__dirname, '../../', 'butterfly-bak')
const utils = require('./controller/utils')
const config = require('./config')[process.env.APP_ENV || 'dev']
const logFile = path.join(__dirname, '../logs/schedule.log')
// const { execSync } = require('child_process')

async function log (str, type = 'info') {
  await fs.writeFile(logFile, `\n[${type}]: ${new Date().toString()} ${str}`, { flag: 'a' })
}

async function cloneGit () {
  if (config.bakGit) {
    await log('git 不存在，clone git 到本地')
    return utils.spawn('git', ['clone', config.bakGit], {
      cwd: path.resolve(__dirname, '../../')
    }).then(() => {
      log('clone git 到本地成功', 'success')
    }).catch(err => {
      log('clone git 到本地失败' + err.toString(), 'error')
      return Promise.reject(err.toString())
    })
  }
}

async function doBak () {
  if (!fs.pathExistsSync(gitDir)) {
    await cloneGit()
  }
  // 将 server/public 目录拷贝到 git
  await fs.copy(path.resolve(__dirname, 'public'), path.join(gitDir, 'dev'), { overwrite: true })
  await log('拷贝 server/public 到 git 目录', 'success')
  // pull
  await log('git pull ...')
  await utils.spawn('git', ['pull', '-f'], { cwd: gitDir })
  await log('git pull', 'success')
  // 提交
  await log('git push ...')
  await utils.spawn('git', ['add', '.'], { cwd: gitDir })
  await utils.spawn('git', ['commit', '-m', 'bak by system'], { cwd: gitDir }).catch(() => {})
  await utils.spawn('git', ['push'], { cwd: gitDir })
  await log('git push', 'success')
}

module.exports = {
  async run () {
    if (!fs.pathExistsSync(logFile)) {
      await fs.outputFile(logFile, 'init file at ' + new Date().toString())
    }
    doBak()
    const job = schedule.scheduleJob('0 0 */12 * * *', function () {
      doBak()
      // utils.spawn('bash', ['backup.sh'], { cwd: __dirname })
      //   .then(() => {
      //     log('bash 命令备份成功', 'success')
      //   })
      //   .catch((err) => {
      //     log(`bash 命令备份失败 ${err.toString()}`, 'error')
      //   })
    })
  }
}
