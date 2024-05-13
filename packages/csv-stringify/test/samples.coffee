
import fs from 'node:fs/promises'
import path from 'node:path'
import { spawn } from 'node:child_process'

__dirname = new URL( '.', import.meta.url).pathname
dir = path.resolve __dirname, '../samples'
samples = await fs.readdir dir

describe 'Samples', ->

  samples
  .filter (sample) ->
    return false unless /\.(js|ts)?$/.test sample
    true
  .map (sample) ->

    it "Sample #{sample}", () ->
      data = await fs.readFile path.resolve(dir, sample), 'utf8'
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
