
###
Called by the `parse` function on each line. It is responsible for 
transforming the data and finally calling `write`.
###

Transformer = (csv) ->
  @csv = csv
  @

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

module.exports = Transformer