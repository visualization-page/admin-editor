const request = require('request').defaults({ jar: true })
const MD5 = require('blueimp-md5')
const path = require('path')
const config = require('../config')
const pubPath = path.resolve(__dirname, '../public')
const fs = require('fs-extra')
const utils = require('../controller/utils')

module.exports = {
  syncFile (project) {
    return new Promise((resolve, reject) => {
      const releasePath = path.resolve(__dirname, '../../release', project.dir)
      const data = {
        siteId: project.config.appType,
        sourcePath: releasePath,
        fromPath: project.dir,
        targetPath: project.config.path
      }
      let url = config[process.env.APP_ENV].opsServer + '/ops/butterfly'
      Object.keys(data).forEach((k, i) => {
        url += `${i === 0 ? '?' : '&'}${k}=${data[k]}`
      })
      request.get(
        url,
        // { formData: data },
        // eslint-disable-next-line handle-callback-err
        (err, httpResponse, body) => {
          if (err) {
            reject(err)
          } else {
            resolve(JSON.parse(body))
          }
        }
      )
    })
  },
  async syncIoc (project) {
    const {
      dir,
      config: {
        iocAddress,
        iocAppId,
        iocAppType,
        iocSyncMethod,
        iocAppName,
        iocAppIcon,
        iocComponentSymbol,
        iocAuthInfo
      }
    } = project
    const dirPath = path.join(pubPath, 'project', dir)
    // 在项目目录下新建 xmmprc.json 文件
    const authArr = iocAuthInfo ? iocAuthInfo.split('/') : ['zhuwei', '1234567']
    const releasePath = path.resolve(__dirname, '../../release', dir)
    const data = {
      appId: iocAppId,
      name: iocAppName,
      file: path.join(releasePath, `${dir}.zip`)
    }
    if (iocAppType === 'mp') {
      const localIcon = path.join(dirPath, 'icon.png')
      await utils.downImg(iocAppIcon, localIcon)
      data.icon = localIcon
    } else {
      data.componentSymbol = iocComponentSymbol
    }
    const config = {
      'domain': iocAddress[iocAddress.length - 1] === '/'
        ? iocAddress.substr(0, iocAddress.length - 1)
        : iocAddress,
      'loginUrl': '/baas-login/open/pwdLogin',
      'cardUrl': '/open/smallapp/cardManager/quickCreate',
      'mpUrl': '/open/smallapp/appManager/quickCreate',
      'username': authArr[0],
      'password': authArr[1],
      cardList: [],
      mpList: []
    }
    config[iocAppType === 'mp' ? 'mpList' : 'cardList'].push(data)
    await fs.outputFile(path.join(dirPath, 'xmmprc.json'), JSON.stringify(config))
    // 压缩 zip
    await utils.zip(dir, releasePath)
    let msg = ''
    await utils.spawn(
      'xmmp',
      ['auto', iocAppType, iocSyncMethod, iocAppId, '--auth'],
      { cwd: dirPath },
      str => { msg += str }
    )
    return { success: true, msg }
  },
  login: async (mobile, password) => {
    const param = {
      winSysName: 'Mac OS_chrome_80.0.3987',
      version: '1.0.0_web',
      loginInfo: MD5(mobile) + MD5(MD5(mobile) + MD5(password))
    }
    return new Promise((resolve, reject) => {
      request.post('http://web.jituancaiyun.net/access/IMLogin/webCypherLogin', {
        body: JSON.stringify(param),
        headers: {
          Host: 'web.jituancaiyun.net',
          Referer: 'http://web.jituancaiyun.net/',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
          'X-Requested-With': 'XMLHttpRequest'
        }
      }, (err, httpResponse, body) => {
        body = JSON.parse(body)
        if (err || body.retcode !== 0) {
          reject(JSON.stringify(body))
          return
        }
        const uid = body.data.webloginStruct.userId
        request.post('http://web.jituancaiyun.net/access/IMLogin/getValidOrgIds', {
          body: JSON.stringify({
            uid,
            orgType: 1
          })
        }, (err, httpResponse, body) => {
          if (err) {
            throw err
          }
          const orgIds = JSON.parse(body).data.validOrgIds
          const inset = [57171554250, 83817]
          const orgId = inset.find(x => orgIds.includes(x)) ? inset[0] : orgIds[0]
          request.post('http://web.jituancaiyun.net/access/Contacts/getUserInfo', {
            body: JSON.stringify({
              queryUid: uid,
              orgId
            })
          }, (err, httpResponse, body) => {
            if (err) {
              throw err
            }
            const data = JSON.parse(body).data.users[0]
            resolve(data)
          })
        })
      })
    })
  },

  async caiyunUpload (fileBuffer) {
    return new Promise((resolve, reject) => {
      request.post(
        {
          url: config[process.env.APP_ENV].fileServer,
          formData: {
            upfile: fileBuffer
          },
          headers: {
            Origin: 'https://internal.jituancaiyun.com',
            Referer: 'https://internal.jituancaiyun.com/fe/upload/index.html'
            // Cookie: `mToken=${mToken}`
          }
        },
        (err, httpResponse, body) => {
          if (err) {
            reject(err)
          } else {
            resolve(body)
          }
        }
      )
    })
  },

  async getRemoteFileContent (url) {
    return new Promise((resolve, reject) => {
      request.get({
        url
      }, (err, httpResponse, body) => {
        if (err) {
          reject(err)
        } else {
          resolve(body)
        }
      })
    })
  }
}
