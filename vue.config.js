// fuck! build application usage is not same with build lib
const externals = process.env.VUE_APP_FILE_SERVER ? {
  vue: 'Vue',
  'element-ui': 'ELEMENT',
  '@vue/composition-api': 'vueCompositionApi',
  vant: 'vant'
} : {
  vue: {
    commonjs: 'Vue',
    commonjs2: 'Vue',
    root: 'Vue'
  },
  vant: {
    commonjs: 'vant',
    commonjs2: 'vant',
    root: 'vant'
  },
  'element-ui': {
    commonjs: 'ELEMENT',
    commonjs2: 'ELEMENT',
    root: 'ELEMENT'
  },
  '@vue/composition-api': {
    commonjs: 'vueCompositionApi',
    commonjs2: 'vueCompositionApi',
    root: 'vueCompositionApi'
  }
}

module.exports = {
  pages: {
    index: {
      entry: 'src/main.ts',
      outputDir: 'dist/',
      template: 'public/index.html',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
    render: {
      entry: 'src/render/src/main.js',
      outputDir: 'dist/render/',
      template: 'src/render/index.html',
      chunks: ['chunk-vendors', 'chunk-common', 'render']
    }
  },
  configureWebpack: config => {
    config.externals = externals
  },
  devServer: {
    disableHostCheck: true
  }
}
