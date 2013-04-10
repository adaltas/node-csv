
###
Test CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)
###

fs = require 'fs'
should = require 'should'
csv = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'escape', ->

  # Note: we only escape quote and escape character
  it 'should honor the default double quote escape charactere', (next) ->
    csv()
    .from.string("""
      20322051544,"19""79.0",8.8017226E7,"A""B""C",45,2000-01-01
      28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
      """, escape: '"')
    .on 'record', (record, index) ->
      if index is 0
        record[1].should.eql '19"79.0'
        record[3].should.eql 'A"B"C'
    .to.string (result) ->
      result.should.eql """
      20322051544,"19""79.0",8.8017226E7,"A""B""C",45,2000-01-01
      28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
      """
      next()

  it 'should honor the backslash escape charactere', (next) ->
    csv()
    .from.string("""
      20322051544,"19\\"79.0",8.8017226E7,"A\\"B\\"C",45,2000-01-01
      28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
      """, escape: '\\')
    .on 'record', (record, index) ->
      if index is 0
        record[1].should.eql '19"79.0'
        record[3].should.eql 'A"B"C'
    .to.string (result) ->
      result.should.eql """
      20322051544,"19\\"79.0",8.8017226E7,"A\\"B\\"C",45,2000-01-01
      28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
      """
      next()

  it 'should parse if next char is not in the current chunk', (next) ->
    util = require 'util'
    {Stream} = require 'stream'
    ChunksStream = (chunks) ->
      self = @
      i = 0;
      tick = ->
        if i < chunks.length
          self.emit 'data', chunks[i++]
          process.nextTick tick
        else
          self.emit 'end'
      process.nextTick tick
    util.inherits ChunksStream, Stream
    ChunksStream.prototype.destroy = -> # ok
    data = ['"field with \\', '" inside"']
    records = []
    csv()
    .from.stream(new ChunksStream(data), escape: '\\')
    .on 'error', (err) ->
      next err
    .on 'record', (record) ->
      records.push record
    .on 'end', (c) ->
      records.length.should.eql 1
      records[0][0].should.eql 'field with " inside'
      next()




