
# CSV for Node.js and the web

[![Build Status](https://img.shields.io/github/workflow/status/adaltas/node-csv/Node.js)](https://github.com/adaltas/node-csv/actions)
[![NPM](https://img.shields.io/npm/dm/csv)](https://www.npmjs.com/package/csv) [![NPM](https://img.shields.io/npm/v/csv)](https://www.npmjs.com/package/csv)

The `csv` project provides CSV generation, parsing, transformation and serialization
for Node.js.

It has been tested and used by a large community over the years and should be
considered reliable. It provides every option you would expect from an advanced
CSV parser and stringifier.

This package exposes 4 packages:

* [`csv-generate`](https://csv.js.org/generate/)
  ([GitHub](https://github.com/adaltas/node-csv/tree/master/packages/csv-generate)),
  a flexible generator of CSV string and Javascript objects.
* [`csv-parse`](https://csv.js.org/parse/)
  ([GitHub](https://github.com/adaltas/node-csv/tree/master/packages/csv-parse)),
  a parser converting CSV text into arrays or objects.
* [`csv-stringify`](https://csv.js.org/stringify/)
  ([GitHub](https://github.com/adaltas/node-csv/tree/master/packages/csv-stringify)),
  a stringifier converting records into a CSV text.
* [`stream-transform`](https://csv.js.org/transform/)
  ([GitHub](https://github.com/adaltas/node-csv/tree/master/packages/stream-transform)),
  a transformation framework.

## Documentation

The full documentation for the current version is available [here](https://csv.js.org).

## Usage

Installation command is `npm install csv`.

Each package is fully compatible with the Node.js stream 2 and 3 specifications.
Also, a simple callback-based API is always provided for convenience.

## Sample

This example uses the Stream API to create a processing pipeline.

```js
// Import the package
import * as csv from '../lib/index.js';

// Run the pipeline
csv
// Generate 20 records
  .generate({
    delimiter: '|',
    length: 20
  })
// Transform CSV data into records
  .pipe(csv.parse({
    delimiter: '|'
  }))
// Transform each value into uppercase
  .pipe(csv.transform((record) => {
    return record.map((value) => {
      return value.toUpperCase();
    });
  }))
// Convert objects into a stream
  .pipe(csv.stringify({
    quoted: true
  }))
// Print the CSV stream to stdout
  .pipe(process.stdout);
```

## Development

This parent project doesn't have tests itself but instead delegates the
tests to its child projects.

Read the documentation of the child projects for additional information.

## Contributors

The project is sponsored by [Adaltas](https://www.adaltas.com), an Big Data consulting firm based in Paris, France.

*   David Worms: <https://github.com/wdavidw>

## Related projects

*   Pavel Kolesnikov "ya-csv": <http://github.com/koles/ya-csv>
*   Chris Williams "node-csv": <http://github.com/voodootikigod/node-csv>
*   Mat Holt "PapaParse": <https://github.com/mholt/PapaParse>

[travis]: https://travis-ci.org/
[travis-csv-generate]: http://travis-ci.org/adaltas/node-csv-generate
[travis-csv-parse]: http://travis-ci.org/adaltas/node-csv-parse
[travis-stream-transform]: http://travis-ci.org/adaltas/node-stream-transform
[travis-csv-stringify]: http://travis-ci.org/adaltas/node-csv-stringify
