var path = require('path')
var webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  entry: process.env.entry || path.resolve(__dirname, '../', `src/components/basic-components/${process.env.dir}/index.ts`),
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: './',
    library: `bf-${process.env.dir}`,
    libraryTarget: 'window',
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        exclude: /node_modules/,
        options: {
          loaders: {
            'less': 'vue-style-loader!css-loader!less-loader'
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      },
      // 它会应用到普通的 `.css` 文件
      // 以及 `.vue` 文件中的 `<style>` 块
      {
        test: /\.less$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'less-loader'
        ]
      }
      // {
      //   test: /\.(png|jpg|gif|svg)$/,
      //   loader: 'file-loader',
      //   exclude: /node_modules/,
      //   options: {
      //     name: '[name].[ext]?[hash]'
      //   }
      // }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json'],
    alias: {
      // 'vue$': 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, '../src')
    }
  },
  externals: {
    vue: 'Vue',
    'element-ui': 'ELEMENT',
    '@vue/composition-api': 'vueCompositionApi',
    vant: 'vant'
  },
  // devServer: {
  //   historyApiFallback: true,
  //   noInfo: true
  // },
  performance: {
    hints: 'warning'
  },
  // devtool: '#eval-source-map',
  plugins: [
  ]
}

// if (process.env.NODE_ENV === 'production') {
// module.exports.devtool = '#source-map'
// http://vue-loader.vuejs.org/en/workflow/production.html
module.exports.plugins = (module.exports.plugins || []).concat([
  new VueLoaderPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"production"'
    }
  })
  // new webpack.optimize.UglifyJsPlugin({
  //   sourceMap: true,
  //   compress: {
  //     warnings: false
  //   }
  // }),
  // new webpack.LoaderOptionsPlugin({
  //   minimize: true
  // })
])
// }
