import typescript from 'rollup-plugin-typescript'
import vue from 'rollup-plugin-vue'
import alias from '@rollup/plugin-alias'
import resolve from '@rollup/plugin-node-resolve'

const path = require('path')
const customResolver = resolve({
  extensions: ['.ts']
})
const projectRootDir = path.resolve(__dirname)

export default {
  input: path.resolve(projectRootDir, '../src/components/basic-components/button/index.ts'),
  output: {
    dir: '../dist',
    format: 'iife',
    globals: {
      vue: 'Vue',
      'element-ui': 'ELEMENT',
      '@vue/composition-api': 'vueCompositionApi'
    }
  },
  external: ['vue', 'element-ui', '@vue/composition-api'],
  plugins: [
    alias({
      entries: {
        '@': path.resolve(projectRootDir, '../src')
      },
      customResolver
    }),
    resolve(),
    typescript({
      tsconfig: false,
      experimentalDecorators: true,
      module: 'es2015'
    }),
    vue()
  ]
}
