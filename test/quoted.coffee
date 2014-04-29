
fs = require 'fs'
should = require 'should'
stringify = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'quoted', ->
  
  it 'surround fields', (next) ->
    count = 0
    data = ''
    stringifier = stringify quoted: true, eof: false
    stringifier.on 'readable', ->
      while(d = stringifier.read())
        data += d
    stringifier.on 'record', (record, index) ->
      count++
    stringifier.on 'finish', ->
      count.should.eql 2
      data.should.eql """
      "20322051544","1979.0","8.801""7226E7","ABC"
      "283928""98392","1974.0","8.8392926E7","DEF"
      """
      next()
    stringifier.write [ '20322051544','1979.0','8.801"7226E7','ABC' ]
    stringifier.write [ '283928"98392','1974.0','8.8392926E7','DEF' ]
    stringifier.end()

