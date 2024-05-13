
fs = require 'node:fs'
path = require 'node:path'
{ spawn } = require 'node:child_process'

dir = path.resolve __dirname, '../lib'
samples = fs.readdirSync dir

describe 'Samples', ->
  samples
  .filter (sample) ->
    return false unless /\.(js|ts)?$/.test sample
    true
  .map (sample) ->
    it "Sample #{sample}", () ->
      data = await fs.promises.readFile path.resolve(dir, sample), 'utf8'
      return if /^["|']skip test["|']/.test data
      new Promise (resolve, reject) ->
        ext = /\.(\w+)?$/.exec(sample)[0]
        [cmd, ...args] = switch ext
          when '.js'
            ['node', path.resolve dir, sample]
          when '.ts'
            ['node', '--loader', 'ts-node/esm', path.resolve dir, sample]
        spawn(cmd, args)
          .on 'close', (code) -> if code is 0 then resolve() else reject(new Error 'Failure')
          .stdout.on 'data', (->)
