
fs = require 'fs'
{ Readable } = require 'stream'
generate = require 'csv-generate'
parse = require '../lib'

describe 'API pipe', ->

  it 'piping in and reading out', (next) ->
    finished = false
    parser = parse()
    data = []
    generator = generate length: 2, seed: 1, columns: 2, fixed_size: true
    parser.on 'readable', ->
      while d = parser.read()
        data.push d
    parser.on 'end', ->
      finished = true
    parser.on 'end', ->
      finished.should.be.ok
      data.should.eql [
        [ 'OMH', 'ONKCHhJmjadoA' ]
        [ 'D', 'GeACHiN' ]
      ]
      next()
    generator.pipe(parser)

  it 'piping in and callback out', (next) ->
    generator = generate length: 2, seed: 1, columns: 2, fixed_size: true
    generator.pipe parse (err, data) ->
      data.should.eql [
        [ 'OMH', 'ONKCHhJmjadoA' ]
        [ 'D', 'GeACHiN' ]
      ]
      next()

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

  it 'handle empty string', (next) ->
    s = new Readable()
    s._read = ->
      @push null
    s.pipe parse
      delimiter: ','
    , (err, records) ->
      records.should.eql [] unless err
      next err

 
