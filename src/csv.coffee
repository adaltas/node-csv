
###

Node CSV
========

This project provides CSV parsing and has been tested and used 
on a large input file (over 2Gb).

*   Follow the NodeJs streaming API
*   Async and event based
*   Support delimiters, quotes and escape characters
*   Line breaks discovery: line breaks in source are detected and reported to destination
*   Data transformation
*   Support for large datasets
*   Complete test coverage as sample and inspiration

Important, this readme cover the current version of the node 
csv parser. The documentation for the current version 0.1.0 is 
available [here](https://github.com/wdavidw/node-csv-parser/tree/v0.1).

Quick example
-------------

The following example illustrate 4 usages of the library:
1.  Plug a readable stream by defining a file path
2.  Direct output to a file path
3.  Transform the data (optional)
4.  Listen to events (optional)

    // node samples/sample.js
    var csv = require('csv');

    csv()
    .from.stream(fs.createReadStream(__dirname+'/sample.in')
    .to.path(__dirname+'/sample.out')
    .transform( function(data){
      data.unshift(data.pop());
      return data;
    })
    .on('data', function(data,index){
      console.log('#'+index+' '+JSON.stringify(data));
    })
    .on('end', function(count){
      console.log('Number of lines: '+count);
    })
    .on('error', function(error){
      console.log(error.message);
    });

    // Print sth like:
    // #0 ["2000-01-01","20322051544","1979.0","8.8017226E7","ABC","45"]
    // #1 ["2050-11-27","28392898392","1974.0","8.8392926E7","DEF","23"]
    // Number of lines: 2

Pipe example
------------

The module follow a Stream architecture

|-----------|      |---------|---------|       |---------|
|           |      |         |         |       |         |
|           |      |        CSV        |       |         |
|           |      |         |         |       |         |
|  Stream   |      |  Writer |  Reader |       |  Stream |
|  Reader   |.pipe(|   API   |   API   |).pipe(|  Writer |)
|           |      |         |         |       |         |
|           |      |         |         |       |         |
|-----------|      |---------|---------|       |---------|

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

By extending the Node `EventEmitter` class, the library provides 
a few useful events:

*   *data* (function(data, index){})
    Thrown when a new row is parsed after the `transform` callback and with the data being the value returned by `transform`.Note however that the event won't be called if transform return `null` since the record is skipped.
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

Columns names may be provided or discovered in the first line with 
the read options `columns`. If defined as an array, the order must 
match the one of the input source. If set to `true`, the fields are 
expected to be present in the first line of the input source.

You can define a different order and even different columns in the 
read options and in the write options. If the `columns` is not defined 
in the write options, it will default to the one present in the read options. 

When working with fields, the `transform` method and the `data` 
events receive their `data` parameter as an object instead of an 
array where the keys are the field names.

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

###

stream = require 'stream'
state = require './state'
options = require './options'
from = require './from'
to = require './to'
stringifier = require './stringifier'
parser = require './parser'
transformer = require './transformer'

CSV = ->
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
  @parser.on 'row', ( (row) ->
    @transformer.transform row
  ).bind @
  @parser.on 'end', ( ->
    @emit 'end', @state.count
    @readable = false
  ).bind @
  @parser.on 'error', ( (e) ->
    @error e
  ).bind @
  @stringifier = stringifier @
  @transformer = transformer @
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

###

`resume()`
----------

Implementation of the Readable Stream API, resuming the incoming 'data' 
events after a pause()

###
CSV.prototype.resume = ->
  @paused = false
  @emit 'drain'

###

`write(data, [preserve])`
-------------------------

Implementation of the Writable Stream API with a larger signature. Data
may be a string, a buffer, an array or an object.

If data is a string or a buffer, it could span multiple lines. If data 
is an object or an array, it must represent a single line.
Preserve is for line which are not considered as CSV data.

###
CSV.prototype.write = (data, preserve) ->
  return false unless @writable
  # Parse data if it is a string
  if typeof data is 'string' and not preserve
    @parser.parse data
  # Data is ready if it is an array
  else if Array.isArray(data) and not @state.transforming
    @transformer.transform data
  # Write columns
  else
    if @state.count is 0 and @options.to.header is true
      @stringifier.write @options.to.columns or @options.from.columns
    @stringifier.write data, preserve
    if not @state.transforming and not preserve
      @state.count++
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
  @parser.end()

###

`transform(callback)`
---------------------

Register the transformer callback. The callback is a user provided 
function call on each line to filter, enrich or modify the 
dataset. More information in the "transforming data" section.

###
CSV.prototype.transform = (callback) ->
  @transformer.callback = callback
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

