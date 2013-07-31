[![Build Status](https://secure.travis-ci.org/wdavidw/node-csv-parser.png)](http://travis-ci.org/wdavidw/node-csv-parser)

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

Usage
-----

Installation command is `npm install csv`.

### Quick example

```javascript
// node samples/string.js
csv()
.from.string(
  '#Welcome\n"1","2","3","4"\n"a","b","c","d"',
  {comment: '#'} )
.to.array( function(data){
  console.log(data)
} );
// [ [ '1', '2', '3', '4' ], [ 'a', 'b', 'c', 'd' ] ]
```

### Advanced example
    
```javascript
// node samples/sample.js

var fs = require('fs');
var csv = require('csv');

// opts is optional
var opts = ;

csv()
.from.path(__dirname+'/sample.in', { delimiter: ',', escape: '"' })
.to.stream(fs.createWriteStream(__dirname+'/sample.out'))
.transform( function(row){
  row.unshift(row.pop());
  return row;
})
.on('record', function(row,index){
  console.log('#'+index+' '+JSON.stringify(row));
})
.on('close', function(count){
  // when writing to a file, use the 'close' event
  // the 'end' event may fire before the file has been written
  console.log('Number of lines: '+count);
})
.on('error', function(error){
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
csv `parser. The documentation for the previous version (0.1.0) is 
available [here](https://github.com/wdavidw/node-csv-parser/tree/v0.1).

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

*	  David Worms: <https://github.com/wdavidw>
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

Related projects
----------------

*   Pavel Kolesnikov "ya-csv": <http://github.com/koles/ya-csv>
*   Chris Williams "node-csv": <http://github.com/voodootikigod/node-csv>

[travis]: https://travis-ci.org/#!/wdavidw/node-csv-parser

