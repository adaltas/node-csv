<pre>
     _   _           _        _____  _______      __
    | \ | |         | |      / ____|/ ____\ \    / /
    |  \| | ___   __| | ___ | |    | (___  \ \  / / 
    | . ` |/ _ \ / _` |/ _ \| |     \___ \  \ \/ /  
    | |\  | (_) | (_| |  __/| |____ ____) |  \  /   
    |_| \_|\___/ \__,_|\___| \_____|_____/    \/     New BSD License

</pre>

Important, this readme cover the future, and not yet release, version 0.2 of the node csv parser. The documentation for the current version 0.1.0 is available [here][0.1].

This project provides CSV parsing and has been tested and used on a large source file (over 2Gb).

-   Support delimiters, quotes and escape characters
-   Line breaks discovery: line breaks in source are detected and reported to destination
-   Data transformation
-   Async and event based
-   Support for large datasets
-   Complete test coverage as sample and inspiration

Quick example
-------------

Using the library is a 4 steps process:

1.	Create a source
2.	Create a destination (optional)
3.	Transform the data (optional)
4.  Listen to events (optional)

Here is a example:

```javascript
// node samples/sample.js
var csv = require('csv');

csv()
.fromPath(__dirname+'/sample.in')
.toPath(__dirname+'/sample.out')
.transform(function(data){
	data.unshift(data.pop());
	return data;
})
.on('data',function(data,index){
	console.log('#'+index+' '+JSON.stringify(data));
})
.on('end',function(count){
	console.log('Number of lines: '+count);
})
.on('error',function(error){
	console.log(error.message);
});

// Print sth like:
// #0 ["2000-01-01","20322051544","1979.0","8.8017226E7","ABC","45"]
// #1 ["2050-11-27","28392898392","1974.0","8.8392926E7","DEF","23"]
// Number of lines: 2
```

Installing
----------

Via [npm](http://github.com/isaacs/npm):

```bash
npm install csv
```

Via git (or downloaded tarball):

```bash
git clone http://github.com/wdavidw/node-csv-parser.git
```

Transforming data
-----------------

The contract is quite simple, you receive an array of fields for each record and return the transformed record. The return value may be an array, an associative array, a string or null. If null, the record will simply be skipped.

Unless you specify the `columns` read option, `data` are provided as arrays, otherwise they are objects with keys matching columns names.

When the returned value is an array, the fields are merged in order. When the returned value is an object, it will search for the `columns` property in the write or in the read options and smartly order the values. If no `columns` options are found, it will merge the values in their order of appearance. When the returned value is a string, it is directly sent to the destination source and it is your responsibility to delimit, quote, escape or define line breaks.

Example of transform returning a string

```javascript
// node samples/transform.js
var csv = require('csv');

csv()
.from.path(__dirname+'/transform.in')
.to.stream(process.stdout)
.transform(function(data, index){
	return (index>0 ? ',' : '') + data[0] + ":" + data[2] + ' ' + data[1];
});

// Print sth like:
// 82:Zbigniew Preisner,94:Serge Gainsbourg
```

Events
------

By extending the Node `EventEmitter` class, the library provides a few useful events:

*	  *data* (function(data, index){})
    Thrown when a new row is parsed after the `transform` callback and with the data being the value returned by `transform`. Note however that the event won't be called if transform return `null` since the record is skipped.
	  The callback provide two arguments:
	  `data` is the CSV line being processed (by default as an array)
	  `index` is the index number of the line starting at zero
*   *end*
    Emitted when the CSV content has been parsed.
*   *close*
    Emitted when the underlying resource has been closed. For example, when writting to a file with `csv().to.path()`, the event will be called once the writing process is complete and the file closed.
*   *error*
    Thrown whenever an error occured.

Columns
-------

Columns names may be provided or discovered in the first line with the read options `columns`. If defined as an array, the order must match the one of the input source. If set to `true`, the fields are expected to be present in the first line of the input source.

You can define a different order and even different columns in the read options and in the write options. If the `columns` is not defined in the write options, it will default to the one present in the read options. 

When working with fields, the `transform` method and the `data` events receive their `data` parameter as an object instead of an array where the keys are the field names.

```javascript
// node samples/column.js
var csv = require('csv');

csv()
.from.path(__dirname+'/columns.in', {
	columns: true
})
.to.stream(process.stdout, {
	columns: ['id', 'name']
})
.transform(function(data){
	data.name = data.firstname + ' ' + data.lastname
	return data;
});

// Print sth like:
// 82,Zbigniew Preisner
// 94,Serge Gainsbourg
```

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

Contributors
------------

*	David Worms : <https://github.com/wdavidw>
*	Will White : <https://github.com/willwhite>
*	Justin Latimer : <https://github.com/justinlatimer>
*	jonseymour : <https://github.com/jonseymour>
*	pascalopitz : <https://github.com/pascalopitz>
*	Josh Pschorr : <https://github.com/jpschorr>
*   Elad Ben-Israel: <https://github.com/eladb>
*   Philippe Plantier: <https://github.com/phipla>
*   Tim Oxley: <https://github.com/timoxley>
*   Damon Oehlman: <https://github.com/DamonOehlman>
*   Alexandru Topliceanu: <https://github.com/topliceanu>
*   Visup: <https://github.com/visup>
*   Edmund von der Burg: <https://github.com/evdb>

Related projects
----------------

*   Pavel Kolesnikov "ya-csv": <http://github.com/koles/ya-csv>
*   Chris Williams "node-csv": <http://github.com/voodootikigod/node-csv>

[0.1]: https://github.com/wdavidw/node-csv-parser/tree/v0.1
