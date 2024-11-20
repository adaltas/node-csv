const path = require("path");

const config = (mod) => ({
  entry: `./src/${mod}.ts`,
  mode: "development",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: `${mod}.js`,
    path: path.resolve(__dirname, "dist"),
  },
});

module.exports = [
  config("generate"),
  config("parse"),
  config("stringify"),
  config("transform"),
];
