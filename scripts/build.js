var webpack = require("webpack"),
  config = require("../webpack.config"),
  fs = require("fs-extra");

fs.emptyDirSync("dist");

webpack(config, function (err) {
  if (err) throw err;
});
