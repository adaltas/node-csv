
fs = require 'fs'
util = require 'util'
path = require 'path'
{exec} = require 'child_process'
each = require 'each'
  
it 'samples', (callback) ->
  dir = path.resolve __dirname, '../samples'
  fs.readdir dir, (err, samples ) ->
    return callback err if err
    each samples.filter( (sample) -> /\.js/.test.sample)
    .call (sample, callback) ->
      exec "node #{path.resolve dir, sample}", (err) ->
        callback err
    .next callback
      
      
      
    
