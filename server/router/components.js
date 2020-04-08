const component = require('../controller/component')
const fs = require('fs-extra')
const path = require('path')
const tmpPath = path.resolve(__dirname, '../tmp')
const pubPath = path.resolve(__dirname, '../public')
const request = require('request').defaults({ jar: true })
const MD5 = require('blueimp-md5')

module.exports = {
  '/upload': {
    post: async (req, res) => {
      const ok = req.files.file
      if (ok) {
        const file = path.join(tmpPath, ok.name)
        ok.mv(file, async (err) => {
          if (err) {
            throw err
          }
          const msg = await component.upload(file, tmpPath)
          res.json({ success: !msg, msg })
        })
      } else {
        res.json({ success: !!ok, msg: '' })
      }
    }
  },
  '/component/:type': {
    get: async (req, res) => {
      const data = await component.list(req.params.type)
      res.json({ success: true, data })
    },
    post: async (req, res) => {
      const data = await component.update(req.params.type)
      res.json({ success: true, data })
    }
  },
  '/component/export/:type': {
    post: async (req, res) => {
      const ok = await component.export(req.params.type, req.body)
      res.json({ success: ok, msg: ok ? '' : '组件名称已存在' })
    }
  },
  '/component/download/:type': {
    get: async (req, res) => {
      const dir = req.query.name.split('-')[1]
      res.download(path.join(pubPath, req.params.type, dir, `${dir}.zip`), err => {
        if (err) {
          throw err
        }
      })
    }
  },
  '/project/:dir': {
    get: async (req, res) => {
      const data = await component.getProject(req.params.dir)
      res.json({ success: true, data })
    },
    post: async (req, res) => {
      const exist = fs.pathExistsSync(path.join(pubPath, 'project', req.params.dir))
      if (!req.body.force && exist) {
        // 检查是否已存在
        res.json({ success: false, msg: '项目英文名称已存在', code: 6001 })
      } else {
        // 初次创建保存创建人
        if (!exist) {
          req.body.project.createUser = req.body.project.info.userName
        }
        // 保存项目
        await component.saveProject(req.params.dir, JSON.stringify(req.body))
        res.json({ success: true, msg: '' })
      }
    }
  },
  '/project/release/:dir': {
    post: async (req, res) => {
      await component.releaseProject(req.params.dir)
      res.json({ success: true, msg: '' })
    }
  },
  '/delete/:type/:dir': {
    post: async (req, res) => {
      await component.delete(req.params.type, req.params.dir)
      res.json({ success: true, msg: '' })
    }
  },
  '/login': {
    post: async (req, res) => {
      const { url, mobile, password } = req.body
      // console.log(req.body)
      const param = {
        winSysName: 'Mac OS_chrome_80.0.3987',
        version: '1.0.0_web',
        loginInfo: MD5(mobile) + MD5(MD5(mobile) + MD5(password))
      }
      request.post(url, {
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
          res.json({ success: false, msg: JSON.stringify(body) })
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
            res.json({ success: true, data })
          })
        })
      })
    }
  }
}
