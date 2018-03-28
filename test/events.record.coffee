
parse = require '../src'

describe 'events record', ->
  
  it 'emit array', (next) ->
    before = []
    expect = [
      [ 'ABC', '45' ]
      [ 'DEF', '23' ]
    ]
    parser = parse()
    parser.on 'record', (record) ->
      before.push record
    parser.write """
    "ABC","45"
    "DEF","23"
    """
    parser.on 'finish', ->
      before.should.eql expect
      next()
    parser.end()
