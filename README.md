[![Build Status](https://secure.travis-ci.org/wdavidw/node-csv.png)](http://travis-ci.org/wdavidw/node-csv)

<pre>
     _   _           _        _____  _______      __
    | \ | |         | |      / ____|/ ____\ \    / /
    |  \| | ___   __| | ___ | |    | (___  \ \  / / 
    | . ` |/ _ \ / _` |/ _ \| |     \___ \  \ \/ /  
    | |\  | (_) | (_| |  __/| |____ ____) |  \  /   
    |_| \_|\___/ \__,_|\___| \_____|_____/    \/     New BSD License

</pre>

This project provides CSV generation, parsing, transformation and serialization.
It has been tested and used on by a large community over the years and should be
considered reliable. It provides every option you would expect from an advanced 
CSV parser and stringifier.

[![NPM](https://nodei.co/npm/csv.png?stars&downloads)](https://nodei.co/npm/csv/) [![NPM](https://nodei.co/npm-dl/csv.png)](https://nodei.co/npm/csv/)

The project is splitted into 4 packages:   

*   [`csv-generate`](https://github.com/wdavidw/node-csv-generate), a flexible generator of CSV string and Javascript objects.   
*   [`csv-parse`](https://github.com/wdavidw/node-csv-parse), a parser converting CSV text into arrays or objects.   
*   [`stream-transform`](https://github.com/wdavidw/node-stream-transform), a transformation framework.
*   [`csv-stringify`](https://github.com/wdavidw/node-csv-stringify), a stringifier converting records into a CSV text.   

The full documentation for the current version 0.4 isn't yet available other
then the links to the README provided just above. The 
[official documentation][website] still cover the version 0.3.

## Call for feedback

The redesign is an important step forward for this package. A lot of sugar has
been removed in favor of straightforward implementations of the Stream API into
the 4 sub-packages.

We now need your input. Help us with the documentation, write your impressions
discuss additionnal APIs.

## Usage

Installation command is `npm install csv`.

Each modules are fully be compatible with the stream 2 and 3 specifications.
Also, a simple callback-based API is alwasy provided for conveniency.

### Callback example

Execute this script with the command `node samples/callback.js`.

```javascript
var csv = require('csv');

csv.generate({seed: 1, columns: 2, length: 20}, function(err, data){
  csv.parse(data, function(err, data){
    csv.transform(data, function(data){
      return data.map(function(value){return value.toUpperCase()});
    }, function(err, data){
      csv.stringify(data, function(err, data){
        process.stdout.write(data);
      });
    });
  });
});
```

### Stream example

Execute this script with the command `node samples/stream.js`.

```javascript
var csv = require('csv');

var generator = csv.generate({seed: 1, columns: 2, length: 20});
var parser = csv.parse();
var transformer = csv.transform(function(data){
  return data.map(function(value){return value.toUpperCase()});
});
var stringifier = csv.stringify();

generator.on('readable', function(){
  while(data = generator.read()){
    parser.write(data);
  }
});

parser.on('readable', function(){
  while(data = parser.read()){
    transformer.write(data);
  }
});

transformer.on('readable', function(){
  while(data = transformer.read()){
    stringifier.write(data);
  }
});

stringifier.on('readable', function(){
  while(data = stringifier.read()){
    process.stdout.write(data);
  }
});
```

### Pipe example

Execute this script with the command `node samples/pipe.js`.
    
```javascript
var csv = require('csv');

csv.generate  ({seed: 1, columns: 2, length: 20}).pipe(
csv.parse     ()).pipe(
csv.transform (function(record){
                return record.map(function(value){return value.toUpperCase()});
              })).pipe(
csv.stringify ()).pipe(process.stdout);
```

Migration
---------

This README covers the current version 0.2.x of the `node 
csv `parser. The documentation for the previous version (0.1.0) is 
available [here](https://github.com/wdavidw/node-csv/tree/v0.1). The 
documentation for the incoming 0.3.x version is not yet released.

The functions 'from*' and 'to*' are now rewritten as 'from.*' and 'to.*'. The 'data'
event is now the 'record' event. The 'data' now receives a stringified version 
of the 'record' event.

The documentation for olders version are available on GitHub: 
[0.1.x](https://github.com/wdavidw/node-csv/tree/v0.1), 
[0.2.x](https://github.com/wdavidw/node-csv/tree/v0.2).

Development
-----------

Tests are executed with mocha. To install it, simple run `npm install`, it will
install mocha and its dependencies in your project "node_modules" directory.

To run the tests:
```bash
npm test
```

The tests run against the CoffeeScript source files.

To generate the JavaScript files:
```bash
make build
```

The test suite is run online with [Travis][travis] against Node.js version 0.6, 0.7, 0.8 and 0.9.

Contributors
------------

*   David Worms: <https://github.com/wdavidw>

Related projects
----------------

*   Pavel Kolesnikov "ya-csv": <http://github.com/koles/ya-csv>
*   Chris Williams "node-csv": <http://github.com/voodootikigod/node-csv>

[travis]: https://travis-ci.org/#!/wdavidw/node-csv
[website]: http://www.adaltas.com/projects/node-csv/

