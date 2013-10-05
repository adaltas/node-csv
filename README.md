
This project provide object transformation.  It implements the latest stream Transform 
api. While developed as a part of the Node.js CSV module (`npm install csv`), it could 
be used indepently.

[Documentation for the mutate module is available here](http://www.adaltas.com/projects/node-csv/mutate).

*   Fully Node.js compliant, pipe through it
*   Run sequentially or in parallel with a define number of callbacks
*   Accept object, array or JSON as input and output

Usage
-----

Installation command is `npm install mutate`.

### Synchronous example with a maximum of 20 concurrent callbacks

You may run this script with the command `node samples/sync.js`. Note how the `use` 
callback is only requesting one argument, the data to mutate.

```javascript
var mutate = require('mutate');
mutate()
.parallel(20)
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

### Run sequentially in sequential mode.

You may run this script with the command `node samples/async.js`. The call `parallel(1)` 
will restrict the number of parallel callback to 1, thus enabling sequential mode. Also, 
note how the `use` callback is requesting two arguments, the data to mutate and the callback 
to call when ready.
    
```javascript
var mutate = require('mutate');
mutate()
.parallel(1)
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

Tests are executed with mocha. To install it, simple run `npm install`, it will install
mocha and its dependencies in your project "node_modules" directory.

To run the tests:
```bash
npm test
```

To generate the JavaScript files:
```bash
make build
```

The test suite is run online with [Travis][travis] against Node.js version 0.6, 0.7, 0.8 and 0.9.

Contributors
------------

*	  David Worms: <https://github.com/wdavidw>

[csv]: https://github.com/wdavidw/node-csv
[travis]: https://travis-ci.org/#!/wdavidw/node-csv-parser

