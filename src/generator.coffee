
Stream = require 'stream'

###

`generator([options])`: Generate random CSV data
------------------------------------------------

Options may include
*   duration          Period to run in milliseconds, default to 4 minutes.
*   nb_columns        Number of fields per record
*   max_word_length   Maximum number of characters per word
*   start             Start the generation right away, otherwise call resume

###

module.exports = (options = {}) ->
  options.duration ?= 4 * 60 * 1000
  options.nb_columns = 8
  options.max_word_length ?= 16
  start = Date.now()
  end = start + options.duration
  reader = new Stream
  reader.readable = true
  reader.resume = ->
    reader.paused = false
    # Already started
    while not reader.paused and reader.readable
      return reader.destroy() if Date.now() > end
      # Line
      line = []
      for nb_words in [0...options.nb_columns]
        # Column
        column = []
        for nb_chars in [0 ... Math.ceil Math.random() * options.max_word_length]
          char = Math.floor Math.random() * 32
          column.push String.fromCharCode char + if char < 16 then 65 else 97 - 16
        line.push column.join ''
      reader.emit 'data', "#{line.join ','}\n"
  reader.pause = ->
    reader.paused = true
  reader.destroy = ->
    reader.readable = false
    reader.emit 'end'
    reader.emit 'close'
  process.nextTick reader.resume if options.start
  reader