
parse = require '../src'

describe 'events record', ->
  
  it 'emit array', (next) ->
    records = []
    parser = parse()
    parser.write """
    "ABC","45"
    "DEF","23"
    """
    parser.on 'record', (record) ->
      records.push record
    parser.on 'finish', ->
      records.should.eql [
        [ 'ABC', '45' ]
        [ 'DEF', '23' ]
      ]
      next()
    parser.end()
