const component = require('../controller/component')
const path = require('path')
const tmpPath = path.resolve(__dirname, '../tmp')

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
  }
}
