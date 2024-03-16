const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
// 关闭语法检查
lintOnSave: false,
devServer: {
  port: 7070,
  proxy: {
    '/api': {
      target: 'http://47.97.183.209:9000',
      changeOrigin: true,
      pathRewrite: { '^/api': '' }
    }
  }
}
})
