
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
      [cmd, ...args] = switch ext
        when '.js'
          ['node', path.resolve dir, sample]
        when '.ts'
          ['node', '--loader', 'ts-node/esm', path.resolve dir, sample]
      spawn(cmd, args)
        .on 'close', (code) -> callback(code isnt 0 and new Error 'Failure')
        .stdout.on 'data', (->)
