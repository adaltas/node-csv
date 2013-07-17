
###

Node CSV
========

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

    // node samples/string.js
    csv()
    .from.string(
      '#Welcome\n"1","2","3","4"\n"a","b","c","d"',
      {comment: '#'} )
    .to.array( function(data){
      console.log(data)
    } );
    // [ [ '1', '2', '3', '4' ], [ 'a', 'b', 'c', 'd' ] ]


Advanced example
----------------

The following example illustrates 4 usages of the library:
1.  Plug a readable stream from a file
2.  Direct output to a file path
3.  Transform each row
4.  Listen to events
    
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

Pipe example
------------

The module follow a Stream architecture. At its core, the parser and 
the stringifier utilities provide a [Stream Writer][writable_stream] 
and a [Stream Reader][readable_stream] implementation available in the CSV API.

    +--------+      +----------+----------+       +--------+
    |        |      |          |          |       |        |
    |        |      |         CSV         |       |        |
    |        |      |          |          |       |        |
    | Stream |      |  Writer  |  Reader  |       | Stream |
    | Reader |.pipe(|   API    |   API    |).pipe(| Writer |)
    |        |      |          |          |       |        |
    |        |      |          |          |       |        |
    +--------+      +----------+----------+       +--------+

Here's a quick example:

    in = fs.createReadStream('./in')
    out = fs.createWriteStream('./out')
    in.pipe(csv()).pipe(out)

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

    +-------+--------+--------------+--------------+-----+
    |       |        |              |              |     |
    | from -> parser -> transformer -> stringifier -> to |
    |       |        |              |              |     |
    +-------+--------+--------------+--------------+-----+

Note, even though the "parser", "transformer" and "singifier" are available
as properties, you won't have to interact with those.
    

###

stream = require 'stream'
state = require './state'
options = require './options'
from = require './from'
to = require './to'
stringifier = require './stringifier'
parser = require './parser'
transformer = require './transformer'
utils = require './utils'

CSV = ->
  self = @
  @paused = false
  # A boolean that is true by default, but turns false after an 'error' occurred, 
  # the stream came to an 'end' or the destroy function is called. 
  @readable = true
  # A boolean that is true by default, but turns false after an 'error' occurred 
  # or after the end and destroy functions are called. 
  @writable = true
  @state = state()
  @options = options()
  @from = from @
  @to = to @
  @parser = parser @
  @parser.on 'row', (row) ->
    self.transformer.write row
  @parser.on 'end', ->
    # Print headers if no records
    self.transformer.headers() if self.state.count is 0
    self.transformer.end()
  @parser.on 'error', (e) ->
    self.error e
  @stringifier = stringifier @
  @transformer = transformer @
  @transformer.on 'end', ->
    # End Of File option
    eof = self.options.to.eof
    if eof
      eof = '\n' if eof is true
      self.stringifier.write eof
    self.emit 'end', self.state.count
    # self.emit 'close', self.state.count
  @
CSV.prototype.__proto__ = stream.prototype

###

`pause()`
---------

Implementation of the Readable Stream API, requesting that no further data 
be sent until resume() is called.

###
CSV.prototype.pause = ->
  @paused = true
  @

###

`resume()`
----------

Implementation of the Readable Stream API, resuming the incoming 'data' 
events after a pause().

###
CSV.prototype.resume = ->
  @paused = false
  @emit 'drain'
  @

###

`write(data, [preserve])`
-------------------------

Implementation of the Writable Stream API with a larger signature. Data
may be a string, a buffer, an array or an object.

If data is a string or a buffer, it could span multiple lines. If data 
is an object or an array, it must represent a single line.
Preserve is for line which are not considered as CSV data.

###
CSV.prototype.write = (chunk, preserve) ->
  return @emit 'error', new Error 'CSV no longer writable' unless @writable
  chunk = chunk.toString() if chunk instanceof Buffer
  # Chunk is a string, we parse it
  if typeof chunk is 'string' and not preserve
    @parser.write chunk
  # Chunk is an array, we transform it
  else if Array.isArray(chunk) and not @state.transforming
    csv = @
    @transformer.write chunk
  # Chunk is an object, we transform it or stringify it
  else
    if preserve or @state.transforming
      @stringifier.write chunk
    else
      @transformer.write chunk
  return not @paused

###

`end()`
-------

Terminate the parsing. Call this method when no more csv data is 
to be parsed. It implement the StreamWriter API by setting the `writable` 
property to "false" and emitting the `end` event.

###
CSV.prototype.end = ->
  return unless @writable
  @readable = false
  @writable = false
  @parser.end()
  @

###

`transform(callback, [options])`
---------------------

Register the transformer callback. The callback is a user provided 
function call on each line to filter, enrich or modify the 
dataset. More information in the "transforming data" section.

###
CSV.prototype.transform = (callback, options) ->
  @transformer.callback = callback
  utils.merge @transformer.options, options if options
  @

###

`error(error)`
--------------

Unified mechanism to handle error, emit the error and mark the 
stream as non readable and non writable.

###
CSV.prototype.error = (e) ->
  @readable = false
  @writable = false
  @emit 'error', e
  # Destroy the input stream
  @readStream.destroy() if @readStream
  @

module.exports = -> new CSV

###
[event]: http://nodejs.org/api/events.html
[stream]: http://nodejs.org/api/stream.html
[writable_stream]: http://nodejs.org/api/stream.html#stream_writable_stream
[readable_stream]: http://nodejs.org/api/stream.html#stream_readable_stream
###
