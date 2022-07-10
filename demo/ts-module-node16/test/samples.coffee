
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'

import { fileURLToPath } from 'url'
__dirname = path.dirname fileURLToPath import.meta.url
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
