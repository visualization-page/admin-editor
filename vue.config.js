// const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
  configureWebpack: {
    plugins: [
      // new MonacoWebpackPlugin({
      //   languages: ['javascript']
      // })
    ],
    externals: {
      // 'element-ui': 'ELEMENT',
      vue: 'Vue'
    }
  }
}
