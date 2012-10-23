
stream = require 'stream'

###
Transforming data
=================

Transformation may occur synchronously or asynchronously dependending
on the provided transform callback and its declared arguments length.

Callback are called for each line and its arguments are :    

*   *data*   
  CSV record
*   *index*   
  Incremented counter
*   *callback*   
  Callback function to be called in asynchronous mode

Unless you specify the `columns` read option, `data` are provided 
as arrays, otherwise they are objects with keys matching columns 
names.

In synchronous mode, the contract is quite simple, you receive an array 
of fields for each record and return the transformed record.

In asynchronous mode, it is your responsibility to call the callback 
provided as the third argument. It must be called with two arguments,
the first one is an error if any, the second is the transformed record.

Transformed records may be an array, an associative array, a 
string or null. If null, the record will simply be skipped. When the 
returned value is an array, the fields are merged in order. 
When the returned value is an object, it will search for 
the `columns` property in the write or in the read options and 
smartly order the values. If no `columns` options are found, 
it will merge the values in their order of appearance. When the 
returned value is a string, it is directly sent to the destination 
source and it is your responsibility to delimit, quote, escape 
or define line breaks.

Transform callback run synchronously:

    csv()
    .from('82,Preisner,Zbigniew\n94,Gainsbourg,Serge')
    .to(console.log)
    .transform(function(data, index){
        return data.reverse()
    });
    // Executing `node samples/transform.js`, print:
    // 94,Gainsbourg,Serge\n82,Preisner,Zbigniew

Transform callback run asynchronously:

    csv()
    .from('82,Preisner,Zbigniew\n94,Gainsbourg,Serge')
    .to(console.log)
    .transform(function(data, index, callback){
        process.nextTick(function(){
            callback(null, data.reverse());
        });
    });
    // Executing `node samples/transform.js`, print:
    // 94,Gainsbourg,Serge\n82,Preisner,Zbigniew

Transform callback returning a string:

    csv()
    .from('82,Preisner,Zbigniew\n94,Gainsbourg,Serge')
    .to(console.log)
    .transform(function(data, index){
        return (index>0 ? ',' : '') + data[0] + ":" + data[2] + ' ' + data[1];
    });
    // Executing `node samples/transform.js`, print:
    // 82:Zbigniew Preisner,94:Serge Gainsbourg

###
Transformer = (csv) ->
  @csv = csv
  @
Transformer.prototype.__proto__ = stream.prototype

### no doc

`transformer(csv).transform(line)`
----------------------------------

Call a callback to transform a line. Called from the `parse` function on each 
line. It is responsible for transforming the data and finally calling `write`.

###
Transformer.prototype.transform = (line) ->
  csv = @csv
  columns = csv.options.from.columns
  if columns
    # Extract column names from the first line
    if csv.state.count is 0 and columns is true
      csv.options.from.columns = line
      return
    # Line stored as an object, keys are column names
    if Array.isArray line
      lineAsObject = {}
      for column, i in columns
        lineAsObject[column] = line[i] or null
      line = lineAsObject
    # Line was provided as an object, we create a new one with only the defined columns
    else
      lineAsObject = {}
      for column, i in columns
        lineAsObject[column] = line[column] or null
      line = lineAsObject
  finish = ( (line) ->
    if csv.state.count is 1 and csv.options.to.header is true
      csv.stringifier.write csv.options.to.columns or columns
    csv.stringifier.write line
    # csv.state.count++
    @emit 'end', csv.state.count if csv.state.transforming is 0 and @closed is true
  ).bind @
  csv.state.count++
  if @callback
    sync = @callback.length isnt 3
    csv.state.transforming++
    done = (err, line) ->
      return csv.error err if err
      isObject = typeof line is 'object' and not Array.isArray line
      if csv.options.to.newColumns and not csv.options.to.columns and isObject
        Object.keys(line)
        .filter( (column) -> columns.indexOf(column) is -1 )
        .forEach( (column) -> columns.push(column) )
      csv.state.transforming--
      finish line
    if sync
      try done null, @callback line, csv.state.count - 1
      catch err then return done err
    else
      try @callback line, csv.state.count - 1, (err, line) ->
        done err, line
  else
    finish line

### no doc
`transformer(csv).end()`
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
