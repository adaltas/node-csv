
import fs from 'fs'
import path from 'path'
import {exec} from 'child_process'

import { fileURLToPath } from 'url';
__dirname = path.dirname fileURLToPath `import.meta.url`
dir = path.resolve __dirname, '../samples'
samples = fs.readdirSync dir
[_, major] = process.version.match(/(\d+)\.\d+\.\d+/)

describe 'Samples', ->

  samples
  .filter (sample) ->
    return false if major < 16 && sample is 'recipe.promises.js'
    true
  .map (sample) ->
    return unless /\.js$/.test sample
    it "Sample #{sample}", (callback) ->
      exec "node #{path.resolve dir, sample}", (err) ->
        callback err
