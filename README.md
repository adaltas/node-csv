
<pre>
     _   _           _        _____  _______      __
    | \ | |         | |      / ____|/ ____\ \    / /
    |  \| | ___   __| | ___ | |    | (___  \ \  / /
    | . ` |/ _ \ / _` |/ _ \| |     \___ \  \ \/ /
    | |\  | (_) | (_| |  __/| |____ ____) |  \  /
    |_| \_|\___/ \__,_|\___| \_____|_____/    \/     New BSD License

</pre>

This project provides CSV generation, parsing, transformation and serialization
for Node.js.

It has been tested and used by a large community over the years and should be
considered reliable. It provides every option you would expect from an advanced
CSV parser and stringifier.

[![NPM](https://nodei.co/npm/csv.png?stars&downloads)](https://nodei.co/npm/csv/) [![NPM](https://nodei.co/npm-dl/csv.png)](https://nodei.co/npm/csv/)

The `csv` package is itself split into 4 packages:

*   [`csv-generate`](https://github.com/adaltas/node-csv-generate),
    a flexible generator of CSV string and Javascript objects. 
    [![Build Status](https://secure.travis-ci.org/adaltas/node-csv-generate.svg?branch=master)][travis-csv-generate]
*   [`csv-parse`](https://github.com/adaltas/node-csv-parse),
    a parser converting CSV text into arrays or objects. 
    [![Build Status](https://secure.travis-ci.org/adaltas/node-csv-parse.svg?branch=master)][travis-csv-parse]
*   [`stream-transform`](https://github.com/adaltas/node-stream-transform),
    a transformation framework.
    [![Build Status](https://secure.travis-ci.org/adaltas/node-stream-transform.svg?branch=master)][travis-stream-transform]
*   [`csv-stringify`](https://github.com/adaltas/node-csv-stringify), 
    a stringifier converting records into a CSV text. 
    [![Build Status](https://secure.travis-ci.org/adaltas/node-csv-stringify.svg?branch=master)][travis-csv-stringify]

## Documentation

The full documentation for the current version is available [here][doc].

## Usage

Installation command is `npm install csv`.

Each package is fully compatible with the stream 2 and 3 specifications.
Also, a simple callback-based API is always provided for convenience.

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

csv.generate({seed: 1, columns: 2, length: 20})
  .pipe(csv.parse())
  .pipe(csv.transform(function(record){
     return record.map(function(value){
       return value.toUpperCase()
     });
  }))
  .pipe(csv.stringify())
  .pipe(process.stdout);
```

Development
-----------

This parent project doesn't have tests itself but instead delegates the
tests to its child projects.

Read the documentation of the child projects for additional information.

Related projects
----------------

*   Pavel Kolesnikov "ya-csv": <http://github.com/koles/ya-csv>
*   Chris Williams "node-csv": <http://github.com/voodootikigod/node-csv>
*   Mat Holt "PapaParse": <https://github.com/mholt/PapaParse>

[travis]: https://travis-ci.org/
[travis-csv-generate]: http://travis-ci.org/adaltas/node-csv-generate
[travis-csv-parse]: http://travis-ci.org/adaltas/node-csv-parse
[travis-stream-transform]: http://travis-ci.org/adaltas/node-stream-transform
[travis-csv-stringify]: http://travis-ci.org/adaltas/node-csv-stringify
[doc]: http://csv.adaltas.com
