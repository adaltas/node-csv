# Stream transformation for Node.js and the web

[![Build Status](https://img.shields.io/github/actions/workflow/status/adaltas/node-csv/nodejs.yml?branch=master)](https://github.com/adaltas/node-csv/actions)
[![NPM](https://img.shields.io/npm/dm/stream-transform)](https://www.npmjs.com/package/stream-transform)
[![NPM](https://img.shields.io/npm/v/stream-transform)](https://www.npmjs.com/package/stream-transform)

The [`stream-transform` project](https://csv.js.org/transform/) is a simple object transformation framework. It is part of the [CSV project](https://csv.js.org/).

The Node.js [`stream.Transform` API](http://nodejs.org/api/stream.html#stream_class_stream_transform) is implemented for scalability. The callback-based and sync APIs are also available for convenience. It is both easy to use and powerful.

## Documentation

- [Project homepage](https://csv.js.org/transform/)
- [API](https://csv.js.org/transform/api/)
- [Options](https://csv.js.org/transform/options/)
- [Handler](https://csv.js.org/transform/handler/)
- [State properties](https://csv.js.org/transform/state/)
- [Examples](https://csv.js.org/transform/examples/)

## Main features

- Extends the native Node.js [transform stream API](http://nodejs.org/api/stream.html#stream_class_stream_transform)
- Simplicity with the optional callback and sync API
- Pipe transformations between readable and writable streams
- Synchronous versus asynchronous user functions
- Sequential and parallel execution
- Accept object, array or JSON as input and output
- Sequential or user-defined concurrent execution
- Skip and multiply records
- Alter or clone input records
- MIT License

## Usage

Run `npm install csv` to install the full CSV module or run `npm install csv-transform` if you are only interested by the CSV stringifier.

The module is built on the Node.js Stream API. Use the callback and sync APIs for simplicity or the stream based API for scalability.

## Example

The [API](https://csv.js.org/transform/api/) is available in multiple flavors. This example illustrates the sync API.

```js
import { transform } from "stream-transform/sync";
import assert from "assert";

const records = transform(
  [
    ["a", "b", "c", "d"],
    ["1", "2", "3", "4"],
  ],
  function (record) {
    record.push(record.shift());
    return record;
  },
);

assert.deepEqual(records, [
  ["b", "c", "d", "a"],
  ["2", "3", "4", "1"],
]);
```

## Development

Tests are executed with mocha. To install it, simple run `npm install` followed by `npm test`. It will install mocha and its dependencies in your project "node_modules" directory and run the test suite. The tests run against the CoffeeScript source files.

To generate the JavaScript files, run `npm run coffee`.

The test suite is run online with [Travis](http://travis-ci.org/wdavidw/node-stream-transform). See the [Travis definition file](https://github.com/adaltas/node-stream-transform/blob/master/.travis.yml) to view the tested Node.js version.

## Contributors

The project is sponsored by [Adaltas](https://www.adaltas.com), an Big Data consulting firm based in Paris, France.

- David Worms: <https://github.com/wdavidw>
