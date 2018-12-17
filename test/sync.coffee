
csv = require '../lib/sync'

describe 'api sync', ->

  it 'expose generate', ->
    csv
    .generate length: 10, objectMode: true
    .length.should.eql 10

  it 'expose parse', ->
    csv
    .parse """
    a,b,c
    1,2,3
    """
    .should.eql [
      [ 'a', 'b', 'c' ]
      [ '1', '2', '3' ]
    ]

  it 'expose transform', ->
    csv
    .transform [
      [ 'a', 'b', 'c' ]
      [ '1', '2', '3' ]
    ], (record) ->
      record.push record.shift()
      record
    .should.eql [
      [ 'b', 'c', 'a' ]
      [ '2', '3', '1' ]
    ]

  it 'expose stringify', ->
    csv
    .stringify [
      [ 'a', 'b', 'c' ]
      [ '1', '2', '3' ]
    ]
    .should.eql """
    a,b,c
    1,2,3
    
    """
    
