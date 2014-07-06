
fs = require 'fs'
should = require 'should'
stringify = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'quotedEmpty', ->
  it 'quotes empty fields (when all not quoted)', (next) ->
    count = 0
    data = ''
    stringifier = stringify quoted: false, quotedEmpty: true, eof: false
    stringifier.on 'readable', ->
      while(d = stringifier.read())
        data += d
    stringifier.on 'record', (record, index) ->
      count++
    stringifier.on 'finish', ->
      count.should.eql 1
      data.should.eql """
      "","","", ,0,""
      """
      next()
    stringifier.write [ undefined,null,'',' ',0,false ]
    stringifier.end()

  it 'quotes empty fields (when strings quoted)', (next) ->
    count = 0
    data = ''
    stringifier = stringify quotedEmpty: true, quotedString: true, eof: false
    stringifier.on 'readable', ->
      while(d = stringifier.read())
        data += d
    stringifier.on 'record', (record, index) ->
      count++
    stringifier.on 'finish', ->
      count.should.eql 1
      data.should.eql """
      "","",""," ",0,""
      """
      next()
    stringifier.write [ undefined,null,'',' ',0,false ]
    stringifier.end()

  it 'prevents quoting empty fields (when strings quoted)', (next) ->
    count = 0
    data = ''
    stringifier = stringify quotedEmpty: false, quotedString: true, eof: false
    stringifier.on 'readable', ->
      while(d = stringifier.read())
        data += d
    stringifier.on 'record', (record, index) ->
      count++
    stringifier.on 'finish', ->
      count.should.eql 1
      data.should.eql """
      ,,," ",0,
      """
      next()
    stringifier.write [ undefined,null,'',' ',0,false ]
    stringifier.end()

  it 'quotes empty fields (when all quoted)', (next) ->
    count = 0
    data = ''
    stringifier = stringify quoted: true, quotedEmpty: true, eof: false
    stringifier.on 'readable', ->
      while(d = stringifier.read())
        data += d
    stringifier.on 'record', (record, index) ->
      count++
    stringifier.on 'finish', ->
      count.should.eql 1
      data.should.eql """
      "","",""," ","0",""
      """
      next()
    stringifier.write [ undefined,null,'',' ',0,false ]
    stringifier.end()
