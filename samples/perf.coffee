#!/usr/bin/env coffee

fs = require 'fs'
csv = require '..'
generator = csv.generator

switch process.argv[2]
  when 'csv' then w = generator(start: true).pipe csv().to.path "#{__dirname}/perf.out"
  when 'fs' then w = generator(start: true).pipe fs.createWriteStream "#{__dirname}/perf.out", flags: 'w'
  when 'null' then w = generator(start: true).pipe csv().to.path "/dev/null"
  when 'stdout' then w = generator(start: true).pipe process.stdout
  else return console.log 'coffee sample/perf.coffee [action] where action is "csv", "fs" or "stdout"'

((fn) ->
  length = 0
  last_length = 0
  last_time = Date.now()
  size = 0
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

