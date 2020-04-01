module.exports = {
  presets: [
    'vca-jsx',
    '@vue/cli-plugin-babel/preset'
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
