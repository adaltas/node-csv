
# CSV generator for Node.js and the web

[![Build Status](https://img.shields.io/github/actions/workflow/status/adaltas/node-csv/nodejs.yml?branch=master)](https://github.com/adaltas/node-csv/actions)
[![NPM](https://img.shields.io/npm/dm/csv-generate)](https://www.npmjs.com/package/csv-generate)
[![NPM](https://img.shields.io/npm/v/csv-generate)](https://www.npmjs.com/package/csv-generate)

The [`csv-generate` package](https://csv.js.org/generate/) provides a flexible generator of random CSV strings and Javascript objects implementing the Node.js `stream.Readable` API. It is part of the [CSV project](https://csv.js.org/).

## Documentation

* [Project homepage](https://csv.js.org/generate/)
* [API](https://csv.js.org/generate/api/)
* [Options](https://csv.js.org/generate/options/)
* [Examples](https://csv.js.org/generate/examples/)

## Main features

* Scalable `stream.Readable` implementation
* random or pseudo-random seed based generation
* Idempotence with the "seed" option
* User-defined value generation
* Multiple types of values (integer, boolean, dates, ...)
* MIT License

## Usage

Run `npm install csv` to install the full CSV module or run `npm install csv-generate` if you are only interested by the CSV generator.

Use the callback and sync APIs for simplicity or the stream based API for scalability.

## Example

The [API](https://csv.js.org/generate/api/) is available in multiple flavors. This example illustrates the stream API.

```js
import { generate } from 'csv-generate';
import assert from 'assert';

const records = [];
// Initialize the generator
generate({
  seed: 1,
  objectMode: true,
  columns: 2,
  length: 2
})
  // Use the readable stream api to consume generated records
  .on('readable', function(){
    let record; while((record = this.read()) !== null){
      records.push(record);
    }
  })
  // Catch any error
  .on('error', function(err){
    console.error(err);
  })
  // Test that the generated records matched the expected records
  .on('end', function(){
    assert.deepEqual(records, [
      [ 'OMH', 'ONKCHhJmjadoA' ],
      [ 'D', 'GeACHiN' ]
    ]);
  });
```

## Development

Tests are executed with [Mocha](https://mochajs.org/). To install it, simple run `npm install` followed by `npm test`. It will install mocha and its dependencies in your project "node_modules" directory and run the test suite. The tests run  against the CoffeeScript source files.

To generate the JavaScript files, run `npm run coffee`.

The test suite is run online with [Travis](https://travis-ci.org/#!/adaltas/node-csv-generate). See the [Travis definition file](https://github.com/adaltas/node-csv-generate/blob/master/.travis.yml) to view the tested Node.js version.

## Contributors

The project is sponsored by [Adaltas](https://www.adaltas.com), an Big Data consulting firm based in Paris, France.

*   David Worms: <https://github.com/wdavidw>
