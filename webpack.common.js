const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/js/app.js",
  plugins: [new CopyPlugin([{ from: "./src/models", to: "models" }])],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  }
};
