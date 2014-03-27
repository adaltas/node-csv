[![Build Status](https://secure.travis-ci.org/wdavidw/node-csv.png)](http://travis-ci.org/wdavidw/node-csv)

<pre>
     _   _           _        _____  _______      __
    | \ | |         | |      / ____|/ ____\ \    / /
    |  \| | ___   __| | ___ | |    | (___  \ \  / / 
    | . ` |/ _ \ / _` |/ _ \| |     \___ \  \ \/ /  
    | |\  | (_) | (_| |  __/| |____ ____) |  \  /   
    |_| \_|\___/ \__,_|\___| \_____|_____/    \/     New BSD License

</pre>

This project provides CSV parsing and has been tested and used 
on large input files. It provides every option you would expect from an
advanced CSV parser and stringifier.

[The full documentation of the CSV parser is available here](http://www.adaltas.com/projects/node-csv/).

[![NPM](https://nodei.co/npm/csv.png?stars&downloads)](https://nodei.co/npm/csv/) [![NPM](https://nodei.co/npm-dl/csv.png)](https://nodei.co/npm/csv/)

IMPORTANT
---------

There is at the moment an important re-design of this module. The project will be split into 4 modules:   

*   [`csv-generate`](https://github.com/wdavidw/node-csv-generate), a flexible generator of CSV string and Javascript objects.   
*   [`csv-parse`](https://github.com/wdavidw/node-csv-parse), a parser converting CSV text into arrays or objects.   
*   [`csv-transform`](https://github.com/wdavidw/node-csv-transform), a simple object transformation framework.
*   [`csv-stringify`](https://github.com/wdavidw/node-csv-stringify), a stringifier converting records into a CSV text.   

All the modules are fully be compatible with the stream 2 and 3 specifications. Also, a simple callback-based API is provided. Those modules are already released and usable separately. They will soon be available as part of this module. We are in the process of dispatching the full test cases into their appropriate module.

Usage
-----

Installation command is `npm install csv --save`.

### Quick example

```javascript
// node samples/string.js
csv()
.from.string('#Welcome\n"1","2","3","4"\n"a","b","c","d"', { comment: '#' })
.to.array(function (data) {
  console.log(data)
});

// Output
// [ [ '1', '2', '3', '4' ], [ 'a', 'b', 'c', 'd' ] ]
```

### Advanced example
    
```javascript
// node samples/sample.js

var fs = require('fs');
var csv = require('csv');
var path = require('path');
var inFile = path.join(__dirname, 'sample.in');
var outFile = path.join(__dirname, 'sample.out');

csv()
.from.path(inFile, { delimiter: ',', escape: '"' })
.to.stream(fs.createWriteStream(outFile))
.transform(function (row) {
  row.unshift(row.pop());
  return row;
})
.on('record', function (row, index) {
  console.log('#%s %s', index, JSON.stringify(row));
})
.on('close', function (count) {
  // when writing to a file, use the 'close' event
  // the 'end' event may fire before the file has been written
  console.log('Number of lines: %s', count);
})
.on('error', function (error) {
  console.log(error.message);
});

// Output:
// #0 ["2000-01-01","20322051544","1979.0","8.8017226E7","ABC","45"]
// #1 ["2050-11-27","28392898392","1974.0","8.8392926E7","DEF","23"]
// Number of lines: 2
```

Migration
---------

This README covers the current version 0.2.x of the `node 
csv` parser. The documentation for the previous version (0.1.0) is 
available [here](https://github.com/wdavidw/node-csv/tree/v0.1). The documentation 
for the incoming 0.3.x version is not yet released.

The functions 'from*' and 'to*' are now rewritten as 'from.*' and 'to.*'. The 'data'
event is now the 'record' event. The 'data' now receives a stringified version of 
the 'record' event.

Development
-----------

Tests are executed with mocha. To install it, simple run `npm install`, it will install
mocha and its dependencies in your project "node_modules" directory.

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
*	  Will White: <https://github.com/willwhite>
*	  Justin Latimer: <https://github.com/justinlatimer>
*	  jonseymour: <https://github.com/jonseymour>
*	  pascalopitz: <https://github.com/pascalopitz>
*	  Josh Pschorr: <https://github.com/jpschorr>
*   Elad Ben-Israel: <https://github.com/eladb>
*   Philippe Plantier: <https://github.com/phipla>
*   Tim Oxley: <https://github.com/timoxley>
*   Damon Oehlman: <https://github.com/DamonOehlman>
*   Alexandru Topliceanu: <https://github.com/topliceanu>
*   Visup: <https://github.com/visup>
*   Edmund von der Burg: <https://github.com/evdb>
*   Douglas Christopher Wilson: <https://github.com/dougwilson>
*   Chris Khoo: <https://github.com/khoomeister>
*   Joeasaurus: <https://github.com/Joeasaurus>

Related projects
----------------

*   Pavel Kolesnikov "ya-csv": <http://github.com/koles/ya-csv>
*   Chris Williams "node-csv": <http://github.com/voodootikigod/node-csv>

[travis]: https://travis-ci.org/#!/wdavidw/node-csv

