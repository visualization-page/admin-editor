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
          let msg
          const isSyncProject = req.body.type === 'sync-project'
          if (isSyncProject) {
            msg = await component.syncProject(file, tmpPath)
          } else {
            msg = await component.uploadProject(file, tmpPath)
          }
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
      if (
        new RegExp('render.html').test(req.headers.referer) ||
        !!req.query.preview
      ) {
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
        userName === '杨明' ||
        userName === '诸炜'
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
      const result = await component.releaseProject(req.params.dir, req.body).catch(err => ({
        success: false,
        msg: err ? err.message : ''
      }))
      res.json(result || { success: true, msg: '' })
    }
  },
  '/project/copy/:dir': {
    post: async (req, res) => {
      const data = await component.getProject(req.params.dir)
      data.project.dir = req.body.newDir
      data.project.createUser = data.project.info.userName = req.body.name
      data.project.info.remark = '复制项目'
      data.project.info.time = Date.now()
      // 将发布配置清空
      data.project.config.path = ''
      delete data.force
      const result = await component.saveProject(data.project.dir, data)
      // 解锁
      await component.lockProject(data.project.dir)
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
  '/project/download-check/:dir': {
    get: async (req, res) => {
      const dir = req.params.dir
      const releasePath = path.resolve(__dirname, '../../release', dir)
      const success = fs.pathExistsSync(releasePath)
      res.json({ success, msg: success ? '' : `${dir} 项目还未发布` })
    }
  },
  '/project/download/:dir': {
    get: async (req, res) => {
      const dir = req.params.dir
      const releasePath = path.resolve(__dirname, '../../release', dir)
      // if (fs.pathExistsSync(zipPath)) {
      //   utils.rm(zipPath)
      // }
      // await utils.spawn('zip', ['-qr', `${dir}.zip`, './'], { cwd: releasePath })
      await utils.zip(dir, releasePath)
      const zipPath = path.join(releasePath, `${dir}.zip`)
      res.download(zipPath, err => {
        if (err) {
          throw err
        }
      })
    }
  },
  '/project/record/:dir': {
    get: async (req, res) => {
      const dir = req.params.dir
      const json = await fs.readJson(path.join(pubPath, 'project', dir, 'record.json')).catch(() => [])
      res.json({ success: true, data: json })
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
      let sso = req.cookies.sso_u
      // let sso = 'eyJ1aWRfIjoxMDEwMTAwMTE5NjY2OTg2NCwibmFtZV8iOiLnq6Dpm6jlpYciLCJtb2JpbGVfIjoiMTM3Nzc0NzAzNTciLCJ0YWdzXyI6MH0='
      if (sso) {
        // ascii 默认是 8 位
        // base64 是 6 位
        // 还要将多余的 = 号去除
        sso = sso.replace(/=/g, '')
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
      const doBuffer = async (buffer) => {
        if (req.body.minify) {
          console.log('=== 开启 tinypng 压缩')
          buffer = await utils.tinyfy(buffer, req.body.key).catch(err => {
            console.log(`=== tinypng 压缩 出错 ${err.message}`)
            res.json({ success: false, msg: err.message })
          })
          console.log(`=== tinypng 压缩 完成`)
        }
        if (buffer) {
          const data = await service.caiyunUpload(buffer)
          res.json({ success: true, data })
        }
      }
      if (ok) {
        const file = path.join(tmpPath, ok.name)
        ok.mv(file, async (err) => {
          if (err) {
            throw err
          }
          const fileBuffer = fs.createReadStream(file)
          await doBuffer(fileBuffer)
          utils.rm(tmpPath)
        })
      } else if (req.body.base64) {
        const base64 = req.body.base64.replace(/=/g, '')
        const dataBuffer = Buffer.alloc(base64.length * 6 / 8, req.body.base64, 'base64')
        await doBuffer(dataBuffer)
      } else {
        res.json({ success: !!ok, msg: '' })
      }
    }
  },

  '/umd-component': {
    post: async (req, res) => {
      const data = req.body
      await component.saveList(data, 'umd')
      res.json({ success: true })
    }
  },

  '/utils-component': {
    post: async (req, res) => {
      const data = req.body
      await component.saveList(data, 'utils')
      res.json({ success: true })
    }
  },

  '/project/pub-search/:keyword': {
    async get (req, res) {
      const result = await service.searchDeployProject(req.params.keyword, {
        ...req.cookies,
        uid: req.query.uid
      })
      res.json({ success: true, data: result })
    }
  },

  '/folder/save': {
    async post (req, res) {
      const msg = await component.saveFolder(req.body)
      res.json({ success: !msg, msg })
    }
  },

  '/folder/get': {
    async get (req, res) {
      const data = await component.getFolder(req.query.id)
      const msg = typeof data === 'string' ? data : ''
      res.json({ success: !msg, msg, data })
    }
  },

  '/folder/delete': {
    async post (req, res) {
      const msg = await component.deleteFolder(req.body)
      res.json({ success: !msg, msg })
    }
  },

  '/folder/list': {
    async get (req, res) {
      const data = await component.listFolder()
      res.json({ success: true, data })
    }
  },

  '/version/list': {
    async get (req, res) {
      const data = await component.listVersion(req.query)
      res.json({ success: true, data })
    }
  },

  '/version/add': {
    async get (req, res) {
      const msg = await component.addVersion(req.query)
      res.json({ success: !msg, msg })
    }
  },

  '/version/delete': {
    async get (req, res) {
      const msg = await component.deleteVersion(req.query)
      res.json({ success: !msg, msg })
    }
  },

  '/version/switch': {
    async get (req, res) {
      await component.switchVersion(req.query)
      res.json({ success: true })
    }
  },

  '/list': {
    async get (req, res) {
      // const { folderId, dirs } = req.query
      const data = await component.getCombindList(req.query)
      res.json({ success: true, data })
    }
  },

  '/search': {
    async get (req, res) {
      const data = await component.searchProject(req.query)
      res.json({ success: true, data })
    }
  },

  '/system': {
    get: async (req, res) => {
      const data = await fs.readJson(path.join(pubPath, 'system', 'index.json'))
      res.json({ success: true, data: Array.isArray(data) ? {} : data })
    },
    post: async (req, res) => {
      await fs.writeJson(path.join(pubPath, 'system', 'index.json'), req.body.data)
      res.json({ success: true })
    }
  },

  '/checkstatus': {
    get: async (req, res) => {
      await component.init()
      res.json({ success: true })
    }
  }
}
