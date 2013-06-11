
stream = require 'stream'

###
Transforming data
=================

Transformations may occur synchronously or asynchronously depending
on the provided transform callback and its declared arguments length.

Callbacks are called for each line, with these arguments:    

*   *row*   
  CSV record
*   *index*   
  Incremented counter
*   *callback*   
  Callback function to be called in asynchronous mode

If you specify the `columns` read option, the `row` argument will be 
provided as an object with keys matching columns names. Otherwise it
will be provided as an array.

In synchronous mode, the contract is quite simple, you will receive an array 
of fields for each record and the transformed array should be returned.

In asynchronous mode, it is your responsibility to call the callback 
provided as the third argument. It must be called with two arguments,
an error (if any), and the transformed record.

Transformed records may be an array, an associative array, a 
string or `null`. If `null`, the record will simply be skipped. When the
returned value is an array, the fields are merged in order. 
When the returned value is an object, the module will search for
the `columns` property in the write or in the read options and 
intelligently order the values. If no `columns` options are found, 
it will merge the values in their order of appearance. When the 
returned value is a string, it is directly sent to the destination 
and it is your responsibility to delimit, quote, escape 
or define line breaks.

Transform callback run synchronously:

    csv()
    .from('82,Preisner,Zbigniew\n94,Gainsbourg,Serge')
    .to(console.log)
    .transform(function(row, index){
        return row.reverse()
    });
    // Executing `node samples/transform.js`, print:
    // 94,Gainsbourg,Serge\n82,Preisner,Zbigniew

Transform callback run asynchronously:

    csv()
    .from('82,Preisner,Zbigniew\n94,Gainsbourg,Serge')
    .to(console.log)
    .transform(function(row, index, callback){
        process.nextTick(function(){
            callback(null, row.reverse());
        });
    });
    // Executing `node samples/transform.js`, print:
    // 94,Gainsbourg,Serge\n82,Preisner,Zbigniew

Transform callback returning a string:

    csv()
    .from('82,Preisner,Zbigniew\n94,Gainsbourg,Serge')
    .to(console.log)
    .transform(function(row, index){
        return (index>0 ? ',' : '') + row[0] + ":" + row[2] + ' ' + row[1];
    });
    // Executing `node samples/transform.js`, print:
    // 82:Zbigniew Preisner,94:Serge Gainsbourg

###
Transformer = (csv) ->
  @csv = csv
  @running = 0
  @options = parallel: 100
  @todo = []
  @
Transformer.prototype.__proto__ = stream.prototype
### no doc

`headers()`
----------------------------

Print headers.

###
Transformer.prototype.headers = ->
  labels = @csv.options.to.columns or @csv.options.from.columns
  # If columns is an object, keys are fields and values are labels
  if typeof labels is 'object' then labels = for k, label of labels then label
  @csv.stringifier.write labels

### no doc

`write(line)`
----------------------------------

Call a callback to transform a line. Called for each line after being parsed. 
It is responsible for transforming the data and finally calling `write`.

###
Transformer.prototype.write = (line) ->
  self = @
  csv = @csv
  # Sanitize columns option into state and cache the result
  if not @columns?
    columns = csv.options.from.columns
    if typeof columns is 'object' and columns isnt null and not Array.isArray columns
      columns = Object.keys columns
    # Extract column names from the first line
    if csv.state.count is 0 and columns is true
      columns = csv.options.from.columns = line
      return
    @columns = if columns? then columns else false
  else columns = @columns
  # Convert line to an object
  if columns
    # Line provided as an array and stored as an object, keys are column names
    if Array.isArray line
      lineAsObject = {}
      for column, i in columns
        lineAsObject[column] = if line[i]? then line[i] else null
      line = lineAsObject
    # Line was provided as an object, we create a new one with only the defined columns
    else
      lineAsObject = {}
      for column, i in columns
        lineAsObject[column] = if line[column]? then line[column] else null
      line = lineAsObject
  finish = (line) ->
    # Print header on first line if we need to
    self.headers() if csv.options.to.header is true and (csv.state.count - self.running) is 1
    # Stringify the transformed line
    csv.stringifier.write line
    # Pick line if any
    line = self.todo.shift()
    return run line if line
    # Emit end event if we are closed and we have no more transformation going on
    self.emit 'end', csv.state.count if csv.state.transforming is 0 and self.closed is true
  csv.state.count++
  return finish line unless @callback
  sync = @callback.length isnt 3
  csv.state.transforming++
  self = @
  done = (err, line) ->
    self.running--
    return csv.error err if err
    isObject = typeof line is 'object' and not Array.isArray line
    if isObject and csv.options.to.newColumns and not csv.options.to.columns
      Object.keys(line)
      .filter( (column) -> self.columns.indexOf(column) is -1 )
      .forEach( (column) -> self.columns.push(column) )
    csv.state.transforming--
    finish line
  run = (line) ->
    self.running++
    try
      if sync
      then done null, self. callback line, csv.state.count - self.todo.length - 1
      else self.callback line, csv.state.count - self.todo.length - 1, done
    catch err
      done err
  # Apply back pressure
  if @running is @options.parallel
    @todo.push line
    return false
  # Work on current line
  run line
  true

### no doc
`end()`
------------------------

A transformer instance extends the EventEmitter and 
emit the 'end' event when the last callback is called.

###
Transformer.prototype.end = ->
  return @csv.error new Error 'Transformer already closed' if @closed
  @closed = true
  @emit 'end' if @csv.state.transforming is 0

module.exports = (csv) -> new Transformer csv
module.exports.Transformer = Transformer
