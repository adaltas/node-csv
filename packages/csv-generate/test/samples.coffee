
fs = require('fs').promises
util = require 'util'
path = require 'path'
{exec} = require 'child_process'
each = require 'each'
  
it 'samples', ->
  dir = path.resolve __dirname, '../samples'
  samples = await fs.readdir dir
  each samples.filter( (sample) -> /\.js/.test.sample)
  .call (sample, callback) ->
    exec "node #{path.resolve dir, sample}", (err) ->
      callback err
  .promise()
      
      
      
    
