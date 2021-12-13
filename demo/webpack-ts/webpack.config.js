const path = require('path');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

const config = (mod, fallbacks={}) => ({
    entry: `./src/${mod}.ts`,
    mode: 'development',
    plugins: [new NodePolyfillPlugin()],
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
      // fallback: {
      //   // ...{
      //   //   "stream": require.resolve("stream-browserify"),
      //   //   "buffer": false,
      //   // },
      //   // ...fallbacks
      // }
    },
    output: {
      filename: `${mod}.js`,
      path: path.resolve(__dirname, 'dist'),
    },
  })

module.exports = [
  config('generate', {
    // "util": require.resolve("util"),
    "util": false,
  }),
  config('parse', {
    // "buffer": require.resolve("buffer/"),
    "buffer": false,
  }),
  config('stringify', {
  }),
  config('transform', {
    // "util": require.resolve("util/"),
    "util": false,
  }),
];
