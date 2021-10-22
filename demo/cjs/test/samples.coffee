
fs = require 'fs'
path = require 'path'
{ exec } = require 'child_process'

dir = path.resolve __dirname, '../lib'
samples = fs.readdirSync dir

describe 'Samples', ->
  samples
  .filter (sample) ->
    return false unless /\.(js|ts)?$/.test sample
    true
  .map (sample) ->
    it "Sample #{sample}", (callback) ->
      ext = /\.(\w+)?$/.exec(sample)[0]
      bin = switch ext
        when '.js'
          'node'
        when '.ts'
          'node --loader ts-node/esm'
      exec "#{bin} #{path.resolve dir, sample}", (err, stdout, stderr) ->
        callback err
