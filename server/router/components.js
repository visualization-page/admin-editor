const component = require('../controller/component')
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
  '/project/:dir': {
    get: async (req, res) => {
      const data = await component.getProject(req.params.dir)
      res.json({ success: true, data })
    },
    post: async (req, res) => {
      if (!req.body.force && fs.pathExistsSync(path.join(pubPath, 'project', req.params.dir))) {
        // 检查是否已存在
        res.json({ success: false, msg: '项目英文名称已存在', code: 6001 })
      } else {
        // 保存项目
        await component.saveProject(req.params.dir, JSON.stringify(req.body))
        res.json({ success: true, msg: '' })
      }
    }
  }
}
