
import { generate } from '../lib/index.js'

describe 'api read', ->

  it 'sync read text', (next) ->
    buffers = []
    generator = generate length: 5, seed: 1, columns: 2
    generator.on 'readable', ->
      while buffer = generator.read()
        Buffer.isBuffer buffer
        buffers.push buffer
    generator.on 'error', next
    generator.on 'end', ->
      Buffer.concat(buffers).toString().should.eql """
      OMH,ONKCHhJmjadoA
      D,GeACHiN
      nnmiN,CGfDKB
      NIl,JnnmjadnmiNL
      KB,dmiM
      """
      next()

  it 'sync read objects', (next) ->
    rows = []
    generator = generate length: 5, objectMode: true, seed: 1, columns: 2
    generator.on 'readable', ->
      while row = generator.read()
        rows.push row
    generator.on 'error', next
    generator.on 'end', ->
      rows.should.eql [
        [ 'OMH', 'ONKCHhJmjadoA' ]
        [ 'D', 'GeACHiN' ]
        [ 'nnmiN', 'CGfDKB' ]
        [ 'NIl', 'JnnmjadnmiNL' ]
        [ 'KB', 'dmiM' ]
      ]
      next()

  it 'async read', (next) ->
    @timeout 0
    rows = []
    generator = generate length: 5, objectMode: true, seed: 1, columns: 2
    generator.on 'readable', ->
      length = 0
      run = ->
        row = generator.read()
        return unless row
        length += row.join('').length
        rows.push row
        setTimeout run, 10
      run()
    generator.on 'error', next
    generator.on 'end', ->
      rows.should.eql [
        [ 'OMH', 'ONKCHhJmjadoA' ]
        [ 'D', 'GeACHiN' ]
        [ 'nnmiN', 'CGfDKB' ]
        [ 'NIl', 'JnnmjadnmiNL' ]
        [ 'KB', 'dmiM' ]
      ]
      next()
