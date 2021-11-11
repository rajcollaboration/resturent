module.exports = {
  pwa: {
    themeColor: '#5200a3',
    msTileColor: '#ffffff',
    iconPaths: {
      msTileImage: 'img/icons/mstile-150x150.png'
    }
  },
  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false
    }
  },
  transpileDependencies: [
    'quasar'
  ]
}
