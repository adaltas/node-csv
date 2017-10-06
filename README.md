[![Build Status](https://secure.travis-ci.org/adaltas/node-csv-stringify.svg)][travis]

Part of the [CSV module][csv_home], this project is a stringifier converting
arrays or objects input into a CSV text. It implements the Node.js
[`stream.Transform` API][stream_transform]. It also provides a simple
callback-based API for convenience. It is both extremely easy to use and
powerful. It was first released in 2010 and is used against big data sets by a
large community.

[Documentation for the "csv-stringify" package is available here][home].

## Features

*   Follow the Node.js streaming API
*   Simplicity with the optional callback API
*   Support for custom formatters, delimiters, quotes, escape characters and header
*   Support big datasets
*   Complete test coverage and samples for inspiration
*   no external dependencies
*   to be used conjointly with `csv-generate`, `csv-parse` and `stream-transform`
*   BSD License

Usage
-----

Refer to the [project webpage][home] for [an exhaustive list of options][home]
and [some usage examples][examples]. 

The module is built on the Node.js Stream API. For the sake of simplify, a
simple callback API is also provided. To give you a quick look, here's an
example of the callback API:

```javascript
var stringify = require('csv-stringify');

input = [ [ '1', '2', '3', '4' ], [ 'a', 'b', 'c', 'd' ] ];
stringify(input, function(err, output){
  output.should.eql('1,2,3,4\na,b,c,d');
});
```

Development
-----------

Tests are executed with mocha. To install it, simple run `npm install` 
followed by `npm test`. It will install mocha and its dependencies in your 
project "node_modules" directory and run the test suite. The tests run 
against the CoffeeScript source files.

To generate the JavaScript files, run `npm run coffee`.

The test suite is run online with [Travis][travis] against the versions 
0.10, 0.11 and 0.12 of Node.js.

Contributors
------------

*   David Worms: <https://github.com/wdavidw>

[home]: http://csv.adaltas.com/stringify/
[examples]: http://csv.adaltas.com/stringify/examples/
[csv]: https://github.com/adaltas/node-csv
[travis]: https://travis-ci.org/#!/adaltas/node-csv-stringify
