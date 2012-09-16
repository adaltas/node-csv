
###
Transforming data
-----------------

The contract is quite simple, you receive an array of fields for 
each record and return the transformed record. The return value 
may be an array, an associative array, a string or null. If null, 
the record will simply be skipped.

Unless you specify the `columns` read option, `data` are provided 
as arrays, otherwise they are objects with keys matching columns 
names.

When the returned value is an array, the fields are merged in 
order. When the returned value is an object, it will search for 
the `columns` property in the write or in the read options and 
smartly order the values. If no `columns` options are found, 
it will merge the values in their order of appearance. When the 
returned value is a string, it is directly sent to the destination 
source and it is your responsibility to delimit, quote, escape 
or define line breaks.

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
###
Transformer = (csv) ->
  @csv = csv
  @

###

`transform(line)`
-----------------

Call a callback to transform a line. Used by the `parse` function on each 
line. It is responsible for transforming the data and finally calling `write`.

###
Transformer.prototype.transform = (line) ->
  columns = @csv.options.from.columns
  if columns
    # Extract column names from the first line
    if @csv.state.count is 0 and columns is true
      @csv.options.from.columns = columns = line
      return
    # Line stored as an object in which keys are column names
    lineAsObject = {}
    for column, i in columns
      lineAsObject[column] = line[i] or null
    line = lineAsObject
  if @callback
    @csv.state.transforming = true
    try line = @callback line, @csv.state.count
    catch e then return @csv.error e
    isObject = typeof line is 'object' and not Array.isArray line
    if @csv.options.to.newColumns and not @csv.options.to.columns and isObject
      Object.keys(line)
      .filter( (column) -> columns.indexOf(column) is -1 )
      .forEach( (column) -> columns.push(column) )
    @csv.state.transforming = false
  if @csv.state.count is 0 and @csv.options.to.header is true
    @csv.stringifier.write @csv.options.to.columns or columns
  @csv.stringifier.write line
  @csv.state.count++

module.exports = (csv) -> new Transformer csv
module.exports.Transformer = Transformer
