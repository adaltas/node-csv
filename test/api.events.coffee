
parse = require '../src'

describe 'api events', ->
  
  it 'emit record before write', (next) ->
    before = []
    parser = parse()
    parser.on 'record', (record) ->
      before.push record
    parser.on 'data', -> while this.read() then null 
    parser.write """
    "ABC","45"
    "DEF","23"
    """
    parser.on 'end', ->
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
    parser.on 'data', -> while this.read() then null 
    parser.on 'end', ->
      after.should.eql [
        [ 'ABC', '45' ]
        [ 'DEF', '23' ]
      ]
      next()
    parser.end()
