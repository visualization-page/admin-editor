const component = require('../controller/component')
const service = require('../controller/service')
const fs = require('fs-extra')
const path = require('path')
const utils = require('../controller/utils')
const tmpPath = path.resolve(__dirname, '../tmp')
const pubPath = path.resolve(__dirname, '../public')

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
  '/project/upload': {
    post: async (req, res) => {
      const ok = req.files.file
      if (ok) {
        const file = path.join(tmpPath, ok.name)
        ok.mv(file, async (err) => {
          if (err) {
            throw err
          }
          const msg = await component.uploadProject(file, tmpPath)
          res.json({ success: !msg, msg })
        })
      } else {
        res.json({ success: !!ok, msg: '' })
      }
    }
  },
  '/project/:dir': {
    get: async (req, res) => {
      const data = await component.getProject(req.params.dir)
      const lockedBy = component.getLock(data.project.dir)
      if (new RegExp('render.html').test(req.headers.referer)) {
        // 检查 是 render.html
        res.json({ success: true, data })
        return
      } else if (lockedBy && lockedBy !== req.cookies.userName) {
        // 检查锁
        res.json({ success: false, msg: `项目被${lockedBy}锁定编辑，请稍后再试`, code: 6001 })
        return
      }

      // 校验权限
      const hasPriv = req.cookies.userName === data.project.createUser ||
        (data.project.info.whitelist || '').indexOf(req.cookies.userName) > -1 ||
        req.cookies.userName === '杨明'
      if (hasPriv) {
        res.json({ success: true, data })
      } else {
        res.json({ success: false, msg: '无权限！', code: 6001 })
      }
    },
    post: async (req, res) => {
      const result = await component.saveProject(req.params.dir, req.body)
      res.json(result || { success: true, msg: '' })
      // }
    }
  },
  '/project/release/:dir': {
    post: async (req, res) => {
      await component.releaseProject(req.params.dir, req.body)
      res.json({ success: true, msg: '' })
    }
  },
  '/project/copy/:dir': {
    post: async (req, res) => {
      const data = await component.getProject(req.params.dir)
      data.project.dir += '_copy'
      data.project.createUser = data.project.info.userName = req.body.name
      data.project.info.remark = '复制项目'
      data.project.info.time = Date.now()
      delete data.force
      const result = await component.saveProject(data.project.dir, data)
      res.json(result || { success: true, msg: '' })
    }
  },
  '/project/download/:dir': {
    get: async (req, res) => {
      const dir = req.params.dir
      const releasePath = path.resolve(__dirname, '../../release', dir)
      if (fs.pathExistsSync(releasePath)) {
        const zipPath = path.join(releasePath, `${dir}.zip`)
        if (!fs.pathExistsSync(zipPath)) {
          await utils.spawn('zip', ['-qr', `${dir}.zip`, './'], { cwd: releasePath })
        }
        res.download(zipPath, err => {
          if (err) {
            throw err
          }
        })
      } else {
        res.json({ success: false, msg: `${dir} 项目未发布正式版` })
      }
    }
  },
  '/project/lock/:dir': {
    // get (req, res) {
    //   res.json({ success: false, msg: `666` })
    // },
    async post (req, res) {
      await component.lockProject(req.params.dir, req.cookies.userName, req.body.type)
      res.json({ success: true, msg: req.body.type ? '加锁成功' : '解锁成功' })
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
      const { mobile, password } = req.body
      const data = await service.login(mobile, password)
      res.json({ success: true, data })
    }
  }
}
