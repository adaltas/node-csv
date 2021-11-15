
# CSV stringifier for Node.js and the web

[![Build Status](https://img.shields.io/github/workflow/status/adaltas/node-csv/Node.js)](https://github.com/adaltas/node-csv/actions)
[![NPM](https://img.shields.io/npm/dm/csv-stringify)](https://www.npmjs.com/package/csv-stringify)
[![NPM](https://img.shields.io/npm/v/csv-stringify)](https://www.npmjs.com/package/csv-stringify)

The [`csv-stringify` package](https://csv.js.org/stringify/) is a stringifier converting records into a CSV text and
implementing the Node.js [`stream.Transform`
API](https://nodejs.org/api/stream.html). It also provides the easier
synchronous and callback-based APIs for conveniency. It is both extremely easy
to use and powerful. It was first released in 2010 and is tested against big
data sets by a large community.

## Documentation

* [Project homepage](https://csv.js.org/stringify/)
* [API](https://csv.js.org/stringify/api/)
* [Options](https://csv.js.org/stringify/options/)
* [Examples](https://csv.js.org/stringify/examples/)

## Main features

* Follow the Node.js streaming API
* Simplicity with the optional callback API
* Support for custom formatters, delimiters, quotes, escape characters and header
* Support big datasets
* Complete test coverage and samples for inspiration
* Only 1 external dependency
* to be used conjointly with `csv-generate`, `csv-parse` and `stream-transform`
* MIT License

## Usage

Run `npm install csv` to install the full csv module or run `npm install csv-stringify` if you are only interested by the CSV stringifier.

The module is built on the Node.js Stream API. Use the callback and sync APIs for simplicity or the stream based API for scalability.

## Example

The [API](https://csv.js.org/stringify/api/) is available in multiple flavors. This example illustrates the sync API.

```js
import { stringify } from 'csv-stringify/sync';
import assert from 'assert';

const output = stringify([
  [ '1', '2', '3', '4' ],
  [ 'a', 'b', 'c', 'd' ]
]);

assert.equal(output, '1,2,3,4\na,b,c,d\n');
```

## Development

Tests are executed with mocha. To install it, run `npm install` followed by `npm
test`. It will install mocha and its dependencies in your project "node_modules"
directory and run the test suite. The tests run against the CoffeeScript source
files.

To generate the JavaScript files, run `npm run build`.

The test suite is run online with
[Travis](https://travis-ci.org/#!/adaltas/node-csv-stringify). See the [Travis
definition
file](https://github.com/adaltas/node-csv-stringify/blob/master/.travis.yml) to
view the tested Node.js version.

## Contributors

The project is sponsored by [Adaltas](https://www.adaltas.com), an Big Data consulting firm based in Paris, France.

*   David Worms: <https://github.com/wdavidw>

[csv_home]: https://github.com/adaltas/node-csv
[stream_transform]: http://nodejs.org/api/stream.html#stream_class_stream_transform
[examples]: https://csv.js.org/stringify/examples/
[csv]: https://github.com/adaltas/node-csv
