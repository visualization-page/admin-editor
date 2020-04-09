const request = require('request').defaults({ jar: true })
const MD5 = require('blueimp-md5')

module.exports = {
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
