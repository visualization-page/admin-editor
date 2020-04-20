const request = require('request').defaults({ jar: true })
const MD5 = require('blueimp-md5')
const path = require('path')
const config = require('../config')

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
      let url = config.opsServer[process.env.APP_ENV] + '/ops/butterfly'
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
  }
}
