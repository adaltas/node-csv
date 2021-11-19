const path = require('path');

module.exports = [
  {
    entry: './src/csv.js',
    mode: 'development',
    output: {
      filename: 'csv.js',
      path: path.resolve(__dirname, 'dist'),
    }
  },
  {
    entry: './src/csv_sync.js',
    mode: 'development',
    output: {
      filename: 'csv_sync.js',
      path: path.resolve(__dirname, 'dist'),
    }
  },
  {
    entry: './src/generate.js',
    mode: 'development',
    output: {
      filename: 'generate.js',
      path: path.resolve(__dirname, 'dist'),
    }
  },
  {
    entry: './src/generate_sync.js',
    mode: 'development',
    output: {
      filename: 'generate_sync.js',
      path: path.resolve(__dirname, 'dist'),
    }
  },
  {
    entry: './src/parse.js',
    mode: 'development',
    output: {
      filename: 'parse.js',
      path: path.resolve(__dirname, 'dist'),
    }
  },
  {
    entry: './src/parse_sync.js',
    mode: 'development',
    output: {
      filename: 'parse_sync.js',
      path: path.resolve(__dirname, 'dist'),
    }
  },
  {
    entry: './src/transform.js',
    mode: 'development',
    output: {
      filename: 'transform.js',
      path: path.resolve(__dirname, 'dist'),
    }
  },
  {
    entry: './src/transform_sync.js',
    mode: 'development',
    output: {
      filename: 'transform_sync.js',
      path: path.resolve(__dirname, 'dist'),
    }
  },
  {
    entry: './src/stringify.js',
    mode: 'development',
    output: {
      filename: 'stringify.js',
      path: path.resolve(__dirname, 'dist'),
    }
  },
  {
    entry: './src/stringify_sync.js',
    mode: 'development',
    output: {
      filename: 'stringify_sync.js',
      path: path.resolve(__dirname, 'dist'),
    }
  },
];
