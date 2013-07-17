---
language: en
layout: page
title: "Node CSV"
date: 2013-07-17T08:03:53.223Z
comments: false
sharing: false
footer: false
navigation: csv
github: https://github.com/wdavidw/node-csv
source: ./src/index.coffee
---


This project provides CSV parsing and has been tested and used 
on large input files.

*   Follow the Node.js streaming API
*   Async and event based
*   Support delimiters, quotes, escape characters and comments
*   Line breaks discovery: detected in source and reported to destination
*   Data transformation
*   Support for large datasets
*   Complete test coverage as sample and inspiration
*   no external dependencies

Important: this documentation covers the current version (0.2.x) of 
`node-csv-parser`. The documentation for the previous version (0.1.0) is 
available [here](https://github.com/wdavidw/node-csv-parser/tree/v0.1).

Installation
------------

```bash
npm install csv
```

Quick example
-------------

This take a string with a comment and convert it to an array:

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

Advanced example
----------------

The following example illustrates 4 usages of the library:
1.  Plug a readable stream from a file
2.  Direct output to a file path
3.  Transform each row
4.  Listen to events

```javascript

// node samples/sample.js
var csv = require('csv');
var fs = require('fs');
csv()
.from.stream(fs.createReadStream(__dirname+'/sample.in')
.to.path(__dirname+'/sample.out')
.transform( function(row){
  row.unshift(row.pop());
  return row;
})
.on('record', function(row,index){
  console.log('#'+index+' '+JSON.stringify(row));
})
.on('end', function(count){
  console.log('Number of lines: '+count);
})
.on('error', function(error){
  console.log(error.message);
});
// #0 ["2000-01-01","20322051544","1979.0","8.8017226E7","ABC","45"]
// #1 ["2050-11-27","28392898392","1974.0","8.8392926E7","DEF","23"]
// Number of lines: 2

```

Pipe example
------------

The module follow a Stream architecture. At its core, the parser and 
the stringifier utilities provide a [Stream Writer][writable_stream] 
and a [Stream Reader][readable_stream] implementation available in the CSV API.

```javascript

+--------+      +----------+----------+       +--------+
|        |      |          |          |       |        |
|        |      |         CSV         |       |        |
|        |      |          |          |       |        |
| Stream |      |  Writer  |  Reader  |       | Stream |
| Reader |.pipe(|   API    |   API    |).pipe(| Writer |)
|        |      |          |          |       |        |
|        |      |          |          |       |        |
+--------+      +----------+----------+       +--------+

```

Here's a quick example:

```javascript

in = fs.createReadStream('./in')
out = fs.createWriteStream('./out')
in.pipe(csv()).pipe(out)

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

Events
------

The library extends Node [EventEmitter][event] class and emit all
the events of the Writable and Readable [Stream API][stream]. Additionally, the useful "records" event 
is emitted.

*   *record*   
  Emitted by the stringifier when a new row is parsed and transformed. The data is 
  the value returned by the user `transform` callback if any. Note however that the event won't 
  be called if transform return `null` since the record is skipped.
  The callback provides two arguments. `row` is the CSV line being processed (an array or an object)
  and `index` is the index number of the line starting at zero
*   *data*   
  Emitted by the stringifier on each line once the data has been transformed and stringified.
*   *drain*   
*   *end*   
  Emitted when the CSV content has been parsed.
*   *close*   
  Emitted when the underlying resource has been closed. For example, when writting to a file with `csv().to.path()`, the event will be called once the writing process is complete and the file closed.
*   *error*   
  Thrown whenever an error occured.

Architecture
------------

The code is organized mainly around 5 main components. 
The "from" properties provide convenient functions 
to write CSV text or to plug a Stream Reader. The "parser" 
takes this CSV content and transform it into an array or 
an object for each line. The "transformer" provides the ability 
to work on each line in a synchronous or asynchronous mode. 
The "stringifier" takes an array or an object and serializes it into 
CSV text. Finally, the "to" properties provide convenient 
functions to retrieve the text or to write to plug a Stream Writer.

```javascript

+-------+--------+--------------+--------------+-----+
|       |        |              |              |     |
| from -> parser -> transformer -> stringifier -> to |
|       |        |              |              |     |
+-------+--------+--------------+--------------+-----+

```

Note, even though the "parser", "transformer" and "singifier" are available
as properties, you won't have to interact with those.
    

<a name="pause"></a>
`pause()`
---------

Implementation of the Readable Stream API, requesting that no further data 
be sent until resume() is called.


<a name="resume"></a>
`resume()`
----------

Implementation of the Readable Stream API, resuming the incoming 'data' 
events after a pause().


<a name="write"></a>
`write(data, [preserve])`
-------------------------

Implementation of the Writable Stream API with a larger signature. Data
may be a string, a buffer, an array or an object.

If data is a string or a buffer, it could span multiple lines. If data 
is an object or an array, it must represent a single line.
Preserve is for line which are not considered as CSV data.


<a name="end"></a>
`end()`
-------

Terminate the parsing. Call this method when no more csv data is 
to be parsed. It implement the StreamWriter API by setting the `writable` 
property to "false" and emitting the `end` event.


<a name="transform"></a>
`transform(callback, [options])`
---------------------

Register the transformer callback. The callback is a user provided 
function call on each line to filter, enrich or modify the 
dataset. More information in the "transforming data" section.


<a name="error"></a>
`error(error)`
--------------

Unified mechanism to handle error, emit the error and mark the 
stream as non readable and non writable.

[event]: http://nodejs.org/api/events.html
[stream]: http://nodejs.org/api/stream.html
[writable_stream]: http://nodejs.org/api/stream.html#stream_writable_stream
[readable_stream]: http://nodejs.org/api/stream.html#stream_readable_stream
