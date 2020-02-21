const path = require("path");
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const common = require("./webpack.common");

module.exports = merge(common, {
  mode: "development",
  entry: "./src/js/app.js",
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [{ test: /\.css$/, use: ["style-loader", "css-loader"] }]
  },
  plugins: [new HtmlWebpackPlugin({ template: "./src/template.html" })]
});
