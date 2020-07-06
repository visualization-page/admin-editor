module.exports = {
  presets: [
    'vca-jsx',
    '@vue/cli-plugin-babel/preset',
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        targets: {
          ie: 8,
          android: 5
        },
        corejs: {
          version: 3,
          proposals: true
        }
      }
    ]
  ],
  plugins: [
    [
      'import',
      {
        libraryName: 'esc-ui',
        style: true
      },
      'esc-ui'
    ]
  ]
}
