var fs = require('fs')

module.exports = {
  configureWebpack: {
  	externals: fs.readdirSync("node_modules"),
  }
}