module.exports = {
  productionSourceMap: false,
  devServer: {
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/api': {
        target: 'http://192.168.31.130:8001',
        changeOrigin: true
      }
    }
  }
}
