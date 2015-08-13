[![Build Status](https://secure.travis-ci.org/wdavidw/node-csv-parse.png)][travis]

Part of the [CSV module][csv_home], this project is a simple object
transformation framework. It implements the Node.js [`stream.Transform` API][streamtransform].  
It also provides a simple callback-based API for convenience.  
It is both extremely easy to use and powerful.

[Documentation for the "csv-parse" package is available here][home].

## Features

*   Follow the Node.js [streaming API][streamtransform]
*   Simplicity with the optional callback API
*   Synchronous and asynchronous user handler functions
*   Accepts arrays of strings, or arrays of objects as input
*   Sequential or user-defined concurrent execution
*   Skip and create new records
*   Alter or clone input data
*   BSD License

Usage
-----

Refer to the [project webpage][home] for [an exhaustive list of options][home]
and [some usage examples][examples]. 

The module is built on the Node.js Stream API. For the sake of simplify, a
simple callback API is also provided. To give you a quick look, here's an
example of the callback API:

```javascript
var transform = require('stream-transform');

input = [ [ '1', '2', '3', '4' ], [ 'a', 'b', 'c', 'd' ] ];
transform(input, function(data){
  data.push(data.shift());
  return data.join(',')+'\n';
}, function(err, output){
  output.should.eql([ '2,3,4,1\n', 'b,c,d,a\n' ]);
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


[streamtransform]: http://nodejs.org/api/stream.html#stream_class_stream_transform
[home]: http://csv.adaltas.com/transform/
[examples]: http://csv.adaltas.com/transform/examples/
[csv_home]: https://github.com/wdavidw/node-csv
[stream-samples]: https://github.com/wdavidw/node-stream-transform/tree/master/samples
[stream-test]: https://github.com/wdavidw/node-stream-transform/tree/master/test
[travis]: http://travis-ci.org/wdavidw/node-stream-transform

