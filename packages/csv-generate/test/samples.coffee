
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'

import { fileURLToPath } from 'url'
__dirname = path.dirname fileURLToPath import.meta.url
dir = path.resolve __dirname, '../samples'
samples = fs.readdirSync dir

describe 'Samples', ->

  samples.map (sample) ->
    return unless /\.js$/.test sample
    it "Sample #{sample}", (callback) ->
      exec "node #{path.resolve dir, sample}", (err) ->
        callback err
