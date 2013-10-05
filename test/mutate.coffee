
fs = require 'fs'
stream = require 'stream'
util = require 'util'
should = require 'should'
generator = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'generator', ->

  it 'with fixed_size', (next) ->
    @timeout 1000000
    count = 0
    ended = false
    gen = generator encoding: 'utf8', fixed_size: true, highWaterMark: 1024
    gen.on 'readable', ->
      while(data = gen.read())
        # util.print data.length+'\n'
        ended.should.not.be.ok
        data.length.should.eql if count then 1024 else 2048
        if count++ is 100
          ended = true
          gen.end()
    gen.on 'error', (err) ->
      should.not.exists err
    gen.on 'end', ->
      next()

  it 'with default', (next) ->
    @timeout 1000000
    count = 0
    ended = false
    gen = generator encoding: 'utf8', highWaterMark: 1024
    gen.on 'readable', ->
      while(data = gen.read())
        # util.print data.length+'\n'
        ended.should.not.be.ok
        if count++ is 100
          ended = true
          gen.end()
    gen.on 'error', (err) ->
      should.not.exists err
    gen.on 'end', ->
      next()

  it 'with seed', (next) ->
    @timeout 1000000
    count = 0
    ended = false
    data = []
    gen = generator seed: 1, highWaterMark: 32
    gen.on 'readable', ->
      while(d = gen.read())
        # util.print d.length+'\n'
        data.push d
        ended.should.not.be.ok
        if count++ is 2
          ended = true
          gen.end()
    gen.on 'error', (err) ->
      should.not.exists err
    gen.on 'end', ->
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
    gen = generator headers: 3
    gen.on 'readable', ->
      while(d = gen.read())
        data.push d
        if count++ is 2
          gen.end()
    gen.on 'error', (err) ->
      should.not.exists err
    gen.on 'end', ->
      data
      .join('').split('\n')[1].split(',')
      .length.should.eql 3
      next()

  it 'with header callbacks', (next) ->
    @timeout 1000000
    count = 0
    data = []
    gen = generator headers: [
      -> 'a'
      -> 'b'
    ]
    gen.on 'readable', ->
      while(d = gen.read())
        data.push d
        if count++ is 2
          gen.end()
    gen.on 'error', (err) ->
      should.not.exists err
    gen.on 'end', ->
      data
      .join('').split('\n')[1].split(',')
      .should.eql ['a', 'b']
      next()

  it 'with header types', (next) ->
    @timeout 1000000
    count = 0
    data = []
    gen = generator headers: ['int', 'bool'], seed: 1
    gen.on 'readable', ->
      while(d = gen.read())
        data.push d
        if count++ is 2
          gen.end()
    gen.on 'error', (err) ->
      should.not.exists err
    gen.on 'end', ->
      data
      .join('').split('\n')[1].split(',')
      .should.eql ['1790016367053545', '0']
      next()

  it 'with length using readable api', (next) ->
    @timeout 1000000
    count = 0
    data = ''
    gen = generator length: 3
    gen.on 'readable', ->
      while(d = gen.read())
        data += d
    gen.on 'error', (err) ->
      should.not.exists err
    gen.on 'end', ->
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
    gen = generator length: 3
    gen.pipe writer

  describe 'objectMode', ->

    it 'sunc read', (next) ->
      rows = []
      gen = generator length: 5, objectMode: true, seed: 1, headers: 2, highWaterMark: 1
      gen.on 'readable', ->
        while(row = gen.read())
          rows.push row
      gen.on 'error', (err) ->
        should.not.exists err
      gen.on 'end', ->
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
      gen = generator length: 5, objectMode: true, seed: 1, headers: 2, highWaterMark: 10
      gen.on 'readable', ->
        length = 0
        run = ->
          row = gen.read()
          return unless row
          length += row.join('').length
          rows.push row
          setTimeout run, 10
        run()
      gen.on 'error', (err) ->
        should.not.exists err
      gen.on 'end', ->
        rows.should.eql [
          [ 'OMH', 'ONKCHhJmjadoA' ]
          [ 'D', 'GeACHiN' ]
          [ 'nnmiN', 'CGfDKB' ]
          [ 'NIl', 'JnnmjadnmiNL' ]
          [ 'KB', 'dmiM' ]
        ]
        next()

    # it 'honors highWaterMark', (next) ->
    #   # 1 is a very small highWaterMark
    #   count = 0
    #   gen = generator length: 5, objectMode: true, seed: 1, headers: 2, highWaterMark: 2
    #   gen.on 'readable', ->
    #     console.log 'readable'
    #     count++
    #     while row = gen.read() then row
    #   gen.on 'error', (err) ->
    #     should.not.exists err
    #   gen.on 'end', ->
    #     count.should.eql 5
    #     # 20 is a medium highWaterMark
    #     # count = 0
    #     # gen = gen length: 5, objectMode: true, seed: 1, headers: 2, highWaterMark: 20
    #     # gen.on 'readable', ->
    #     #   count++
    #     #   while row = gen.read() then row
    #     # gen.on 'error', (err) ->
    #     #   should.not.exists err
    #     # gen.on 'end', ->
    #     #   count.should.eql 3
    #       # 100 is a large highWaterMark
    #       # count = 0
    #       # gen = generator length: 5, objectMode: true, seed: 1, headers: 2, highWaterMark: 100
    #       # gen.on 'readable', ->
    #       #   while(row = gen.read())
    #       #     count++
    #       # gen.on 'error', (err) ->
    #       #   should.not.exists err
    #       # gen.on 'end', ->
    #       #   count.should.eql 1
    #       #   next()


