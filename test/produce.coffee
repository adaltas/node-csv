
fs = require 'fs'
stream = require 'stream'
util = require 'util'
should = require 'should'
produce = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'produce', ->

  it 'with fixed_size', (next) ->
    @timeout 1000000
    count = 0
    ended = false
    producer = produce encoding: 'utf8', fixed_size: true, highWaterMark: 1024
    producer.on 'readable', ->
      while(data = producer.read())
        # util.print data.length+'\n'
        ended.should.not.be.ok
        data.length.should.eql if count then 1024 else 2048
        if count++ is 100
          ended = true
          producer.end()
    producer.on 'error', (err) ->
      should.not.exists err
    producer.on 'end', ->
      next()

  it 'with default', (next) ->
    @timeout 1000000
    count = 0
    ended = false
    producer = produce encoding: 'utf8', highWaterMark: 1024
    producer.on 'readable', ->
      while(data = producer.read())
        # util.print data.length+'\n'
        ended.should.not.be.ok
        if count++ is 100
          ended = true
          producer.end()
    producer.on 'error', (err) ->
      should.not.exists err
    producer.on 'end', ->
      next()

  it 'with seed', (next) ->
    @timeout 1000000
    count = 0
    ended = false
    data = []
    producer = produce seed: 1, highWaterMark: 32
    producer.on 'readable', ->
      while(d = producer.read())
        # util.print d.length+'\n'
        data.push d
        ended.should.not.be.ok
        if count++ is 2
          ended = true
          producer.end()
    producer.on 'error', next
    producer.on 'end', ->
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
    producer = produce headers: 3
    producer.on 'readable', ->
      while(d = producer.read())
        data.push d
        if count++ is 2
          producer.end()
    producer.on 'error', next
    producer.on 'end', ->
      data
      .join('').split('\n')[1].split(',')
      .length.should.eql 3
      next()

  it 'with header callbacks', (next) ->
    @timeout 1000000
    count = 0
    data = []
    producer = produce headers: [
      -> 'a'
      -> 'b'
    ]
    producer.on 'readable', ->
      while(d = producer.read())
        data.push d
        if count++ is 2
          producer.end()
    producer.on 'error', next
    producer.on 'end', ->
      data
      .join('').split('\n')[1].split(',')
      .should.eql ['a', 'b']
      next()

  it 'with header types', (next) ->
    @timeout 1000000
    count = 0
    data = []
    producer = produce headers: ['int', 'bool'], seed: 1
    producer.on 'readable', ->
      while(d = producer.read())
        data.push d
        if count++ is 2
          producer.end()
    producer.on 'error', next
    producer.on 'end', ->
      data
      .join('').split('\n')[1].split(',')
      .should.eql ['1790016367053545', '0']
      next()

  it 'with length using readable api', (next) ->
    @timeout 1000000
    count = 0
    data = ''
    producer = produce length: 3
    producer.on 'readable', ->
      while(d = producer.read())
        data += d
    producer.on 'error', next
    producer.on 'end', ->
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
    producer = produce length: 3
    producer.pipe writer

  describe 'objectMode', ->

    it 'sunc read', (next) ->
      rows = []
      producer = produce length: 5, objectMode: true, seed: 1, headers: 2, highWaterMark: 1
      producer.on 'readable', ->
        while(row = producer.read())
          rows.push row
      producer.on 'error', next
      producer.on 'end', ->
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
      producer = produce length: 5, objectMode: true, seed: 1, headers: 2, highWaterMark: 10
      producer.on 'readable', ->
        length = 0
        run = ->
          row = producer.read()
          return unless row
          length += row.join('').length
          rows.push row
          setTimeout run, 10
        run()
      producer.on 'error', next
      producer.on 'end', ->
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
    #   producer = produce length: 5, objectMode: true, seed: 1, headers: 2, highWaterMark: 2
    #   producer.on 'readable', ->
    #     console.log 'readable'
    #     count++
    #     while row = producer.read() then row
    #   producer.on 'error', (err) ->
    #     should.not.exists err
    #   producer.on 'end', ->
    #     count.should.eql 5
    #     # 20 is a medium highWaterMark
    #     # count = 0
    #     # producer = producer length: 5, objectMode: true, seed: 1, headers: 2, highWaterMark: 20
    #     # producer.on 'readable', ->
    #     #   count++
    #     #   while row = producer.read() then row
    #     # producer.on 'error', (err) ->
    #     #   should.not.exists err
    #     # producer.on 'end', ->
    #     #   count.should.eql 3
    #       # 100 is a large highWaterMark
    #       # count = 0
    #       # producer = produce length: 5, objectMode: true, seed: 1, headers: 2, highWaterMark: 100
    #       # producer.on 'readable', ->
    #       #   while(row = producer.read())
    #       #     count++
    #       # producer.on 'error', (err) ->
    #       #   should.not.exists err
    #       # producer.on 'end', ->
    #       #   count.should.eql 1
    #       #   next()


