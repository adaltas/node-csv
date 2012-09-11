
events = require 'events'
stream = require 'stream'
fs = require 'fs'
csv = require '..'

duration = 4 * 60 * 1000
# duration = 5 * 1000
start = Date.now()
end = start + duration
nb_columns = 8
max_word_length = 16

# Return a stream reader
generator = (options = {}) ->
  reader = new stream
  reader.readable = true
  reader.resume = ->
    reader.paused = false
    # Already started
    while not reader.paused and reader.readable
      return reader.destroy() if Date.now() > end
      # Line
      line = []
      for nb_words in [0...nb_columns]
        # Column
        column = []
        for nb_chars in [0 ... Math.ceil Math.random()*max_word_length]
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

length = 0
last_length = 0
last_time = start
size = 0
w = generator(start: true).pipe csv().to.path "#{__dirname}/large.out"
# generator(start: true).pipe process.stdout
# w = generator(start: true).pipe fs.createWriteStream "#{__dirname}/large.out", flags: 'w'
((fn) ->
  w.write = (data) ->
    length += data.length
    last_length += data.length
    s = Math.floor length / 1024 / 1024
    speed = last_length / 1024 / 1024 / ((Date.now() - last_time) / 1000)
    speed = Math.round(speed * 100) / 100
    memory = process.memoryUsage().rss / 1024 / 1024
    memory = Math.round(memory * 100) / 100
    if s > size
      console.log "Size: #{s} Mo; Speed: #{speed} Mo/s; Memory: #{memory} Mo"
      size = s 
      last_time = Date.now()
      last_length = 0
    fn.apply @, arguments
)(w.write)
# w.on 'data', (data) ->
#   length += data.length
#   s = Math.floor length / 1024 / 1024
#   if s > size
#     console.log "Size: #{s} Mb; Speed: #{Math.round(length / ((Date.now() - start) * 1000)*100)/100} Kb/s"
#     size = s 


# gen.on 'data', (data) ->
#   res = c.write data
#   # console.log 'write', data, res
#   gen.pause() unless res

# c.on 'drain', ->
#   console.log 'drain'
#   gen.resume()


