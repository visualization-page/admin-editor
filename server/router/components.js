const component = require('../controller/component')
const service = require('../controller/service')
const fs = require('fs-extra')
const path = require('path')
const utils = require('../controller/utils')
const tmpPath = path.resolve(__dirname, '../tmp')
const pubPath = path.resolve(__dirname, '../public')

module.exports = {
  /**
   * 项目文件结构初始化
   */
  '/init': {
    get: async (req, res) => {
      await component.init()
      res.json({ success: true })
    }
  },

  '/component/upload/:type': {
    post: async (req, res) => {
      const ok = req.files.file
      if (ok) {
        const file = path.join(tmpPath, ok.name)
        ok.mv(file, async (err) => {
          if (err) {
            throw err
          }
          const isUpload = req.params.type === 'upload'
          let msg
          if (isUpload) {
            msg = await component.uploadComponent(file, tmpPath, req.body)
          } else {
            msg = await component.uploadComposeComponent(file, tmpPath)
          }
          // const isForce = msg === 60001
          // res.json({ success: !msg, msg: isForce ? '组件已存在，是否覆盖？' : msg, code: isForce && msg })
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
      const obj = await component.export(req.params.type, req.body)
      res.json({ success: !obj, ...(obj || {}) })
    }
  },
  '/component/delete/:type': {
    post: async (req, res) => {
      const p = path.join(pubPath, req.params.type, req.body.dir)
      await utils.rm(p)
      await component.update(req.params.type)
      res.json({ success: true })
    }
  },
  '/component/download/:type': {
    get: async (req, res) => {
      const isUpload = req.params.type === 'upload'
      let dir
      let file
      if (isUpload) {
        dir = req.query.name.split('-').slice(1).join('-')
        file = path.join(pubPath, req.params.type, dir, `${dir}.zip`)
      } else {
        dir = req.query.name
        file = path.join(pubPath, req.params.type, dir, `data.json`)
      }
      res.download(file, err => {
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
      const userName = req.query.name
      const data = await component.getProject(req.params.dir)
      const lockedBy = component.getLock(data.project.dir)
      if (new RegExp('render.html').test(req.headers.referer)) {
        // 检查 是 render.html
        res.json({ success: true, data })
        return
      } else if (lockedBy && lockedBy !== userName) {
        // 检查锁
        res.json({ success: false, msg: `项目被${lockedBy}锁定编辑，请稍后再试`, code: 6001 })
        return
      }

      // 校验权限
      const hasPriv = userName === data.project.createUser ||
        (data.project.info.whitelist || '').indexOf(userName) > -1 ||
        userName === '杨明'
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
      const result = await component.releaseProject(req.params.dir, req.body)
      res.json(result || { success: true, msg: '' })
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
  '/project/export/:dir': {
    get: async (req, res) => {
      const dataPath = path.join(pubPath, 'project', req.params.dir, 'data.json')
      res.download(dataPath, err => {
        if (err) {
          throw err
        }
      })
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
        res.json({ success: false, msg: `${dir} 项目压缩包不存在，请先发布` })
      }
    }
  },
  '/project/lock/:dir': {
    // get (req, res) {
    //   res.json({ success: false, msg: `666` })
    // },
    async post (req, res) {
      await component.lockProject(req.params.dir, req.body.name, req.body.type)
      res.json({ success: true, msg: req.body.type ? '加锁成功' : '解锁成功' })
    }
  },
  '/delete/:type/:dir': {
    post: async (req, res) => {
      await component.delete(req.params.type, req.params.dir)
      res.json({ success: true, msg: '' })
    }
  },

  /**
   * deprecated
   * 模拟的彩云 web 帮登录
   */
  '/login': {
    post: async (req, res) => {
      const { mobile, password } = req.body
      const data = await service.login(mobile, password)
      res.json({ success: true, data })
    }
  },

  /**
   * 手动 parse user
   */
  '/user': {
    get: async (req, res) => {
      const sso = req.cookies.sso_u
      if (sso) {
        // ascii 默认是 8 位
        // base64 是 6 位
        const user = Buffer.alloc(sso.length * 6 / 8, sso, 'base64').toString()
        res.json({ success: !!user, data: JSON.parse(user) })
      } else {
        res.json({ success: false, msg: 'cookie sso is not exist!' })
      }
    }
  },

  '/suggest/save': {
    post: async (req, res) => {
      await component.saveSuggest(req.body)
      res.json({ success: true })
    }
  },

  '/suggest/get': {
    get: async (req, res) => {
      const data = await component.getSuggest()
      res.json({ success: true, data })
    }
  },

  '/babel': {
    get: async (req, res) => {
      const dir = req.query.dir
      const data = await fs.readJson(path.join(pubPath, 'project', dir, 'data.json'))
      // const r = await utils.babelTransform(data.project.utils)
      const r = await utils.babel(data.project)
      res.json({ success: true, data: r })
    }
  },

  '/caiyun-file/upload': {
    post: async (req, res) => {
      const ok = req.files && req.files.file
      if (ok) {
        const file = path.join(tmpPath, ok.name)
        ok.mv(file, async (err) => {
          if (err) {
            throw err
          }
          const fileBuffer = fs.createReadStream(file)
          const data = await service.caiyunUpload(fileBuffer)
          utils.rm(tmpPath)
          res.json({ success: true, data })
        })
      } else if (req.body.base64) {
        const dataBuffer = Buffer.alloc(req.body.size / 6 * 8, req.body.base64, 'base64')
        const data = await service.caiyunUpload(dataBuffer)
        res.json({ success: true, data })
      } else {
        res.json({ success: !!ok, msg: '' })
      }
    }
  },

  '/umd-component': {
    post: async (req, res) => {
      const data = req.body
      await component.saveUmd(data)
      res.json({ success: true })
    }
  }
}
