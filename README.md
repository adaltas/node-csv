[![Build Status](https://secure.travis-ci.org/wdavidw/node-stream-transform.png)][travis]

This project provides a simple object transformation framework implementing the 
Node.js `stream.Transform` API. It was originally developed as a part of the Node.js 
[CSV package][csv] (`npm install csv`) and can be used independently.

[Documentation for the stream-transform package is available here][transform].

*   Simple callback based API
*   Node.js [stream.Transform][streamtransform] API, pipe through it
*   synchronous versus asynchronous user callbacks
*   Accept object, array or JSON as input and output
*   Sequential or user-defined concurrent execution
*   Skip and create new records
*   Alter or clone input data

## Usage

Run `npm install csv` to install the full CSV module or run 
`npm install stream-transform` if you are only interested by this package.

Callback API: `transform(udf, [options])`   

Stream API: `transform(data, [options], udf, [options], [callback])`   

Use the callback style API for simplicity or the stream based API for 
scalability or mix the 2 APIs.

For examples, refer to below examples, [the "samples" folder][stream-samples], 
the documentation or [the "test" folder][stream-test].

## Synchronous versus asynchronous execution

The mode is defined by the signature of transformation function. It is expected
to run synchronously when it declares only one argument, the data to 
transform. It is expected to run asynchronously when it declares two arguments,
the data to transform and the callback to be called once the transformed data
is ready.

In synchronous mode, you may simply return the altered data or throw an error.
In asynchronous mode, you must call the provided callback with 2 arguments, the
error if any and the altered data.

## Array versus objects

The transformation function may either receive arrays or objects.

If you specify the `columns` read option, the `row` argument will be 
provided as an object with keys matching columns names. Otherwise it
will be provided as an array.

## Sequential versus concurrent execution

By sequential, we mean only 1 transformation function is running at a given
time. By concurrent, we mean a maximum of x functions are running in parrallel. 
The number of running functions is defined by the "parallel" option. When set to
"1", the mode is sequential, when above "1", it defines the maximum of running 
functions. Note, this only affect asynchronous executions.

## Skipping and creating records

Skipping records is easily achieved by returning null in synchonous mode or
passing null to the callback handler in asynchonous mode. Generating multiple
records is only supported in asynchonous mode by providing n-arguments after the
error argument instead of simply one.

## Altering or cloning the provided data

The data recieved inside the transformation function is the original data and is
not modified nor cloned. Depending on which api you choose, it may be provided 
in the constructor or send to the `write` function. If you wish to not alter the
original data, it is your responsibility to send a new data in your
transformation function instead of the original modified data.

## Examples

### Using the callback API

The transformer receive a string and return an array inside a user-provided 
callback. This example is available with the command `node samples/callback.js`.

```javascript
var transform = require('stream-transform');
var should = require('should');

transform([
  ['1','2','3','4'],
  ['a','b','c','d']
], function(data){
  data.push(data.shift())
  return data;
}, function(err, output){
  output.should.eql([ [ '2', '3', '4', '1' ], [ 'b', 'c', 'd', 'a' ] ]);
});
```

### Using the stream API

CSV data is send through the `write` function and the resulted data is obtained
within the "readable" event by calling the `read` function. This example is 
available with the command `node samples/stream.js`.

```javascript
var transform = require('stream-transform');
var should = require('should');

var output = [];
var transformer = transform(function(data){
  data.push(data.shift())
  return data;
});
transformer.on('readable', function(){
  while(row = transformer.read()){
    output.push(row);
  }
});
transformer.on('error', function(err){
  console.log(err.message);
});
transformer.on('finish', function(){
  output.should.eql([ [ '2', '3', '4', '1' ], [ 'b', 'c', 'd', 'a' ] ]);
});
transformer.write(['1','2','3','4']);
transformer.write(['a','b','c','d']);
transformer.end();
```

### Using synchronous transformation

You may run this script with the command `node samples/synchronous.js`.

The transformation function is run synchronously because is only expect one 
argument, the data to be transformed. It is expected to return the transformed
data or to throw an error.
    
```javascript
var transform = require('stream-transform');

transform([
  ['1','2','3','4'],
  ['a','b','c','d']
], function(data){
  data.push(data.shift());
  return data.join(',')+'\n';
})
.pipe(process.stdout);

// Output:
// 2,3,4,1
// b,c,d,a
```

### Using asynchronous transformation

You may run this script with the command `node samples/asynchronous.js`.

The transformation callback is requesting two arguments, the data to transform
and the callback to call once the data is ready.

The transformation callback is exected concurrently with a maximum of 20 
parallel executions.

```javascript
var transform = require('stream-transform');

transform([
  ['1','2','3','4'],
  ['a','b','c','d']
], function(data, callback){
  setImmediate(function(){
    data.push(data.shift());
    callback(null, data.join(',')+'\n');
  });
}, {parallel: 20})
.pipe(process.stdout);

// Output:
// 2,3,4,1
// b,c,d,a
```

## Development

Tests are executed with mocha. To install it, simple run `npm install` 
followed by `npm test`. It will install mocha and its dependencies in your 
project "node_modules" directory and run the test suite. The tests run 
against the CoffeeScript source files.

To generate the JavaScript files, run `make build`.

The test suite is run online with [Travis][travis] against the versions 
0.9, 0.10 and 0.11 of Node.js.

## Contributors

*	  David Worms: <https://github.com/wdavidw>

[streamtransform]: http://nodejs.org/api/stream.html#stream_class_stream_transform
[transform]: https://github.com/wdavidw/node-stream-transform
[csv]: https://github.com/wdavidw/node-csv
[stream-samples]: https://github.com/wdavidw/node-stream-transform/tree/master/samples
[stream-test]: https://github.com/wdavidw/node-stream-transform/tree/master/test
[travis]: http://travis-ci.org/wdavidw/node-stream-transform

