[![Build Status](https://secure.travis-ci.org/wdavidw/node-stream-transform.png)][travis]

This project provide a simple object transformation framework implementing the 
Node.js `stream.Transform` API. It was originally developed as a part of the Node.js 
[CSV package][csv] (`npm install csv`) and can be used independently.

[Documentation for the stream-transform package is available here][transform].

*   Fully Node.js compliant, pipe through it
*   Run sequentially or with a defined number of callbacks executed in parallel
*   Accept object, array or JSON as input and output

Usage
-----

Installation command is `npm install stream-transform`.

### Concurrent example with a maximum of 20 parrallel functions

You may run this script with the command `node samples/sync.js`. Note how the 
`use` callback is only requesting one argument, the data to transform.

```javascript
var transform = require('stream-transform');
transform({parallel: 20})
.use(function(data){
  data.push(data.shift())
})
.write( ['1','2','3','4'] )
.write( ['a','b','c','d'] )
.pipe process.stdout
// Output:
// 2,3,4,1
// b,c,d,a
```

### Synchronous example

You may run this script with the command `node samples/async.js`. The call 
`parallel(1)` will restrict the number of parallel callback to 1, thus enabling 
sequential mode. Also, note how the `use` callback is requesting two arguments, 
the data to transform and the callback to call when ready.
    
```javascript
var transform = require('stream-transform');
transform({parallel: 1})
.use(function(row, callback){
  setImmediate(function(){
    row.unshift(row.pop());
    callback(row);
  }
})
.write( ['1','2','3','4'] )
.write( ['a','b','c','d'] )
.pipe process.stdout
// Output:
// 2,3,4,1
// b,c,d,a
```

Development
-----------

Tests are executed with mocha. To install it, simple run `npm install` 
followed by `npm test`. It will install mocha and its dependencies in your 
project "node_modules" directory and run the test suite. The tests run 
against the CoffeeScript source files.

To generate the JavaScript files, run `make build`.

The test suite is run online with [Travis][travis] against the versions 
0.9, 0.10 and 0.11 of Node.js.

Contributors
------------

*	  David Worms: <https://github.com/wdavidw>

[transform]: https://github.com/wdavidw/node-stream-transform
[csv]: https://github.com/wdavidw/node-csv
[travis]: http://travis-ci.org/wdavidw/node-stream-transform

