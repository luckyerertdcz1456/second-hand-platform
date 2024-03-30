const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
// 关闭语法检查
lintOnSave: false,

devServer: {
  port: 4545,
  proxy: {
    '/api': { // http://47.97.183.209:9000
      target: 'http://82.157.184.71:4545',
      // 82.157.184.71
      changeOrigin: true,
      pathRewrite: { '^/api': '' }
    }
  }
}
})
