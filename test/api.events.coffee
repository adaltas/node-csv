
parse = require '../src'

describe 'api events', ->
  
  it 'emit record before write', (next) ->
    before = []
    parser = parse()
    parser.on 'record', (record) ->
      before.push record
    parser.write """
    "ABC","45"
    "DEF","23"
    """
    parser.on 'finish', ->
      before.should.eql [
        [ 'ABC', '45' ]
        [ 'DEF', '23' ]
      ]
      next()
    parser.end()
      
  it 'emit record after write', (next) ->
    after = []
    parser = parse()
    parser.write """
    "ABC","45"
    "DEF","23"
    """
    parser.on 'record', (record) ->
      after.push record
    parser.on 'finish', ->
      after.should.eql [
        [ 'ABC', '45' ]
        [ 'DEF', '23' ]
      ]
      next()
    parser.end()
