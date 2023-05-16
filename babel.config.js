const plugins = [
  "@babel/plugin-proposal-nullish-coalescing-operator",
  "@babel/plugin-proposal-optional-chaining",
  [
    'import',
    {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: true
      // style: name => `${name}/style/less`
    },
    'vant'
  ]
]
if(process.env.NODE_ENV === 'production') {
  plugins.push(["transform-remove-console", { "exclude": [ "error", "warn", "info"] }])
}

module.exports = {
  presets: [
    [
      "@vue/cli-plugin-babel/preset",
      {
        jsx: {
          compositionAPI: true
        }
      }
    ]
  ],
  plugins
}
