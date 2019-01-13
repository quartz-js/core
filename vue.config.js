var fs = require('fs')

module.exports = {
  productionSourceMap: false,
  configureWebpack: {
  	externals: fs.readdirSync("node_modules"),
  }
}