const path = require('path');

module.exports = [
  // start-snippet{csv}
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
  // end-snippet{csv}
  // start-snippet{generate}
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
  // end-snippet{generate}
  // start-snippet{parse}
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
  // end-snippet{parse}
  // start-snippet{transform}
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
  // end-snippet{transform}
  // start-snippet{stringify}
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
