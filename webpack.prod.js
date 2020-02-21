const path = require("path");
const merge = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const common = require("./webpack.common");

module.exports = merge(common, {
  mode: "production",
  entry: "./src/js/app.js",
  output: {
    filename: "[name].[contentHash].bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, "css-loader"] }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: "[name].[contentHash].css" }),
    new CleanWebpackPlugin()
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new OptimizeCssAssetsPlugin(),
      new TerserPlugin(),
      new HtmlWebpackPlugin({
        template: "./src/template.html",
        minify: {
          removeAttributeQuotes: true,
          collapseWhitespace: true,
          removeComments: true
        }
      })
    ]
  }
});
