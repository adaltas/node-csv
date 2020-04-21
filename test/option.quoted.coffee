
fs = require 'fs'
stringify = require '../lib'

describe 'Option `quoted`', ->
  
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
      
  it 'is executed after cast and apply to numbers', (next) ->
    stringify [
      [10.1]
    ],
      delimiter: ';'
      cast: number: (value) ->
        value.toString().replace '.', ','
      quoted_match: ','
    , (err, data) ->
      data.should.eql '"10,1"\n' unless err
      next err
        
  it 'local option in cast overwriting global', (next) ->
    stringify [
      ['10.1', '10.2']
    ],
      delimiter: ';'
      cast: string: (value, {index}) ->
        value: value.replace '.', ','
        quoted_match: if index is 0 then ',' else null
      quoted_match: ','
    , (err, data) ->
      data.should.eql '"10,1";10,2\n' unless err
      next err
