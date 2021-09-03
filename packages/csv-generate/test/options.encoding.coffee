
import generate from '../lib/index.js'

describe 'Option encoding', ->

  it 'generate buffer by default', (next) ->
    generate length: 1, (err, data) ->
      Buffer.isBuffer(data).should.be.true() unless err
      next err

  it 'generate string if defined', (next) ->
    generate length: 1, encoding: 'ascii', (err, data) ->
      data.should.be.a.String() unless err
      next err
