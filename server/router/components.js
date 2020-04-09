const component = require('../controller/component')
const service = require('../controller/service')
const fs = require('fs-extra')
const path = require('path')
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
  '/project/:dir': {
    get: async (req, res) => {
      const data = await component.getProject(req.params.dir)
      res.json({ success: true, data })
    },
    post: async (req, res) => {
      // const exist = fs.pathExistsSync(path.join(pubPath, 'project', req.params.dir))
      // if (!req.body.force && exist) {
      //   // 检查是否已存在
      //   res.json({ success: false, msg: '项目英文名称已存在', code: 6001 })
      // } else {
      //   // 初次创建保存创建人
      //   if (!exist) {
      //     req.body.project.createUser = req.body.project.info.userName
      //   }
      // 保存项目
      const result = await component.saveProject(req.params.dir, req.body)
      res.json(result || { success: true, msg: '' })
      // }
    }
  },
  '/project/release/:dir': {
    post: async (req, res) => {
      await component.releaseProject(req.params.dir)
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
