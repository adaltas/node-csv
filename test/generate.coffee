
stream = require 'stream'
util = require 'util'
should = require 'should'
generate = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'generate', ->

  it 'with fixed_size', (next) ->
    @timeout 1000000
    count = 0
    ended = false
    generator = generate encoding: 'utf8', fixed_size: true, highWaterMark: 1024
    generator.on 'readable', ->
      while(data = generator.read())
        ended.should.not.be.ok
        data.length.should.eql if count then 1024 else 2048
        if count++ is 100
          ended = true
          generator.end()
    generator.on 'error', next
    generator.on 'end', ->
      next()

  it 'with default', (next) ->
    @timeout 1000000
    count = 0
    ended = false
    generator = generate encoding: 'utf8', highWaterMark: 1024
    generator.on 'readable', ->
      while d = generator.read()
        ended.should.not.be.ok
        if count++ is 100
          ended = true
          generator.end()
    generator.on 'error', next
    generator.on 'end', ->
      next()

  it 'with seed', (next) ->
    @timeout 1000000
    count = 0
    ended = false
    data = []
    generator = generate seed: 1, highWaterMark: 32
    generator.on 'readable', ->
      while d = generator.read()
        data.push d
        ended.should.not.be.ok
        if count++ is 2
          ended = true
          generator.end()
    generator.on 'error', next
    generator.on 'end', ->
      data.join('').trim().should.eql """
      OMH,ONKCHhJmjadoA,D,GeACHiN,nnmiN,CGfDKB,NIl,JnnmjadnmiNL
      KB,dmiM,fENL,Jn,opEMIkdmiOMFckep,MIj,bgIjadnn,fENLEOMIkbhLDK
      B,LF,gGeBFaeAC,iLEO,IkdoAAC,hKpD,opENJ,opDLENLDJoAAABFP
      iNJnmjPbhL,Ik,jPbhKCHhJn,fDKCHhIkeAABEM,kdnlh,DKACIl,HgGdoABEMIjP,adlhKCGf
      """
      next()

  it 'with header number', (next) ->
    @timeout 1000000
    count = 0
    data = []
    generator = generate columns: 3
    generator.on 'readable', ->
      while d = generator.read()
        data.push d
        if count++ is 2
          generator.end()
    generator.on 'error', next
    generator.on 'end', ->
      data
      .join('').split('\n')[1].split(',')
      .length.should.eql 3
      next()

  it 'with header callbacks', (next) ->
    @timeout 1000000
    count = 0
    data = []
    generator = generate columns: [
      -> 'a'
      -> 'b'
    ]
    generator.on 'readable', ->
      while d = generator.read()
        data.push d
        if count++ is 2
          generator.end()
    generator.on 'error', next
    generator.on 'end', ->
      data
      .join('').split('\n')[1].split(',')
      .should.eql ['a', 'b']
      next()

  it 'with header types', (next) ->
    @timeout 1000000
    count = 0
    data = []
    generator = generate columns: ['int', 'bool'], seed: 1
    generator.on 'readable', ->
      while d = generator.read()
        data.push d
        if count++ is 2
          generator.end()
    generator.on 'error', next
    generator.on 'end', ->
      data
      .join('').split('\n')[1].split(',')
      .should.eql ['1790016367053545', '0']
      next()

  it 'with length using readable api', (next) ->
    @timeout 1000000
    count = 0
    data = ''
    generator = generate length: 3
    generator.on 'readable', ->
      while d = generator.read()
        data += d
    generator.on 'error', next
    generator.on 'end', ->
      data.split('\n')
      .length.should.eql 3
      next()

  it 'with length using pipe', (next) ->
    @timeout 1000000
    Writer = ->
      stream.Writable.call @
      @_data = ''
      @
    util.inherits Writer, stream.Writable
    Writer.prototype._write = (chunk, encoding, callback) ->
      @_data += chunk.toString()
      callback()
    writer = new Writer
    writer.on 'finish', ->
      writer
      ._data.split('\n')
      .length.should.eql 3
      next()
    generator = generate length: 3
    generator.pipe writer

  describe 'objectMode', ->

    it 'sunc read', (next) ->
      rows = []
      generator = generate length: 5, objectMode: true, seed: 1, columns: 2, highWaterMark: 1
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
      generator = generate length: 5, objectMode: true, seed: 1, columns: 2, highWaterMark: 10
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

    it 'honors highWaterMark', (next) ->
      count = 0
      max = 0
      values = []
      generator = generate length: 100, objectMode: false, seed: 1, columns: 2, highWaterMark: 100
      generator.on 'readable', ->
        while row = generator.read()
          values.push row.length
      # we dont test first and last values:
      # First time, length is twice the highWaterMark
      # Last time, length is only what's left
      values.shift()
      values.pop()
      # check
      for value in values then value.should.be.within 100, 130
      generator.on 'error', next
      generator.on 'end', next





