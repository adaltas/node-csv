
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { dirname } from 'dirname-filename-esm';

__dirname = dirname import.meta
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
      cmd = switch ext
        when '.js'
          'node'
        when '.ts'
          'node --loader ts-node/esm'
      spawn(cmd, [path.resolve dir, sample])
        .on 'close', (code) -> callback(code isnt 0 and new Error 'Failure')
        .stdout.on 'data', (->)
