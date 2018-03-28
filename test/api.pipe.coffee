
fs = require 'fs'
generate = require 'csv-generate'
parse = require '../src'

describe 'api pipe', ->

  it 'work with producer', (next) ->
    finished = false
    parser = parse()
    data = []
    generator = generate length: 2, seed: 1, columns: 2, fixed_size: true
    parser.on 'readable', ->
      while d = parser.read()
        data.push d
    parser.on 'finish', ->
      finished = true
    parser.on 'end', ->
      finished.should.be.ok
      data.should.eql [
        [ 'OMH', 'ONKCHhJmjadoA' ]
        [ 'D', 'GeACHiN' ]
      ]
      next()
    generator.pipe(parser)

  it 'catch source error', (next) ->
    parser = parse()
    parser.on 'error', ->
      next new Error 'Should not pass here'
    parser.on 'end', ->
      next new Error 'Should not pass here'
    rs = fs.createReadStream('/doesnotexist')
    rs.on 'error', (err) ->
      err.code.should.eql 'ENOENT'
      next()
    rs.pipe(parser)

 
