
[![Build Status](https://api.travis-ci.org/adaltas/node-csv-generate.svg)](https://travis-ci.org/#!/adaltas/node-csv-generate)

# CSV and object generation

This package provides a flexible generator of CSV strings and Javascript objects
implementing the Node.js `stream.Readable` API.

[Documentation for the "csv-generate" package is available here][home].

Features includes:

*   random or pseudo-random seed based generation
*   `stream.Readable` implementation
*   BSD License

## Usage

Run `npm install csv` to install the full csv module or run 
`npm install csv-generate` if you are only interested by the CSV generator.

Use the callback style API for simplicity or the stream based API for 
scalability.

## Development

Tests are executed with [Mocha](https://mochajs.org/). To install it, simple run `npm install` followed by `npm test`. It will install mocha and its dependencies in your project "node_modules" directory and run the test suite. The tests run  against the CoffeeScript source files.

To generate the JavaScript files, run `npm run coffee`.

The test suite is run online with [Travis](https://travis-ci.org/#!/adaltas/node-csv-generate). See the [Travis definition file](https://github.com/adaltas/node-csv-generate/blob/master/.travis.yml) to view the tested Node.js version.

## Contributors

*   David Worms: <https://github.com/wdavidw>

[home]: http://csv.adaltas.com/generate/
[csv]: https://github.com/adaltas/node-csv
