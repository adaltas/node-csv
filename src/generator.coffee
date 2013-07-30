Stream = require 'stream'
util = require 'util'
timers = require 'timers'
# Use process.nextTick when setImmediate isn't there for legacy support of node < 0.10
nextTick = if timers.setImmediate then timers.setImmediate else process.nextTick

###

`generator([options])`: Generate random CSV data
================================================

This function is provided for conveniency in case you need to generate random CSV data.

Note, it is quite simple at the moment, more functionnalities could come later. The code 
originates from "./samples/perf.coffee" and was later extracted in case other persons need 
its functionnalities.

Options may include

*   duration          Period to run in milliseconds, default to 4 minutes.
*   nb_columns        Number of fields per record
*   max_word_length   Maximum number of characters per word
*   start             Start the generation on next tick, otherwise you must call resume

Starting a generation

  csv = require 'csv'
  generator = csv.generator
  generator(start: true).pipe csv().to.path "#{__dirname}/perf.out"

###
Generator = (@options = {}) ->
  @options.duration ?= 4 * 60 * 1000
  @options.nb_columns = 8
  @options.max_word_length ?= 16
  @start = Date.now()
  @end = @start + @options.duration
  @readable = true
  nextTick @resume.bind @ if @options.start
  @
Generator.prototype.__proto__ = Stream.prototype

Generator.prototype.resume = ->
  @paused = false
  # Already started
  while not @paused and @readable
    return @destroy() if Date.now() > @end
    # Line
    line = []
    for nb_words in [0...@options.nb_columns]
      # Column
      column = []
      for nb_chars in [0 ... Math.ceil Math.random() * @options.max_word_length]
        char = Math.floor Math.random() * 32
        column.push String.fromCharCode char + if char < 16 then 65 else 97 - 16
      line.push column.join ''
    @emit 'data', new Buffer "#{line.join ','}\n", @options.encoding

Generator.prototype.pause = ->
  @paused = true

Generator.prototype.destroy = ->
  @readable = false
  @emit 'end'
  @emit 'close'

###
`setEncoding([encoding])`

Makes the 'data' event emit a string instead of a Buffer. 
encoding can be 'utf8', 'utf16le' ('ucs2'), 'ascii', or 
'hex'. Defaults to 'utf8'.

###
Generator.prototype.setEncoding = (encoding) ->
  @options.encoding = encoding

module.exports = (options) -> new Generator options
module.exports.Generator = Generator
