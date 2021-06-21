
fs = require('fs').promises
path = require 'path'
{exec} = require 'child_process'

# `describe` label doesnt print because the code inside calling `it` is asynchronous.
# From Mocha.js doc
# https://mochajs.org/#dynamically-generating-tests
# With top-level await you can collect your test data in a dynamic and asynchronous way while the test file is being loaded

describe 'Samples', ->

  dir = path.resolve __dirname, '../samples'
  samples = await fs.readdir dir
  for sample in samples
    continue unless /\.js$/.test sample
    it "Sample #{sample}", (callback) -> 
      exec "node #{path.resolve dir, sample}", (err) ->
        callback err
