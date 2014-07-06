
fs = require 'fs'
should = require 'should'
stringify = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'quotedString', ->
  
  it 'quotes string fields', (next) ->
    count = 0
    data = ''
    stringifier = stringify quotedString: true, eof: false
    stringifier.on 'readable', ->
      while(d = stringifier.read())
        data += d
    stringifier.on 'record', (record, index) ->
      count++
    stringifier.on 'finish', ->
      count.should.eql 1
      data.should.eql """
      ,,""," ","x",0,
      """
      next()
    stringifier.write [ undefined,null,'',' ','x',0,false ]
    stringifier.end()

  it 'quotes empty string fields (when all quoted)', (next) ->
    count = 0
    data = ''
    stringifier = stringify quoted: true, quotedString: true, eof: false
    stringifier.on 'readable', ->
      while(d = stringifier.read())
        data += d
    stringifier.on 'record', (record, index) ->
      count++
    stringifier.on 'finish', ->
      count.should.eql 1
      data.should.eql """
      ,,""," ","x","0",
      """
      next()
    stringifier.write [ undefined,null,'',' ','x',0,false ]
    stringifier.end()
