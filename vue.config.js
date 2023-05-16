const packageName = require('./package.json').name
const path = require('path')

const isProd = process.env.NODE_ENV === 'production'
const cdnDomain = 'https://j1.58cdn.com.cn'

const cdn = {
  css: [
    cdnDomain + '/arthurupload/teg/yunxiao/static/theme/index.css',
    cdnDomain + '/arthurupload/teg/yunxiao/static/iconfont/iconfont.css'
  ],
  js: ['https://j1.58cdn.com.cn/meishi_sdk/meishiPersonalCard.js']
}
const prodJs = [
  cdnDomain + '/arthurupload/teg/yunxiao/static/vue@2.7.x.js',
  cdnDomain + '/arthurupload/teg/yunxiao/static/vue-router@3.6.4.min.js',
  cdnDomain + '/arthurupload/teg/yunxiao/static/element-ui/index.js'
]
if (isProd) {
  cdn.js.unshift(...prodJs)
}

let externals = {
  vue: 'Vue',
  'vue-router': 'VueRouter',
  'element-ui': 'ELEMENT'
}

externals = isProd ? externals : {}

module.exports = {
  publicPath: '/fe-yunxiao-sg/',
  outputDir: 'fe-yunxiao-sg',
  lintOnSave: !isProd ? 'default' : false,
  configureWebpack: {
    externals,
    output: {
      library: `${packageName}-[name]`,
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${packageName}`
    }
  },
  chainWebpack: (config) => {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach((type) =>
      addStyleResource(config.module.rule('scss').oneOf(type))
    )

    config.plugin('html').tap((args) => {
      args[0].cdn = cdn
      args[0].title = '速行'
      return args
    })
  },
  devServer: {
    inline: false,
    port: 5806,
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
}

function addStyleResource(rule) {
  rule
    .use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, './src/assets/styles/var.scss'),
        path.resolve(__dirname, './src/assets/styles/mixins.scss'),
        path.resolve(__dirname, './src/assets/styles/funcs.scss')
      ]
    })
}
