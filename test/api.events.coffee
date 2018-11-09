
parse = require '../lib'

describe 'API events', ->
  
  it 'emit readable event', (next) ->
    records = []
    parser = parse()
    parser.on 'readable', ->
      while record = this.read()
        records.push record
    parser.write """
    "ABC","45"
    "DEF","23"
    """
    parser.on 'end', ->
      records.should.eql [
        [ 'ABC', '45' ]
        [ 'DEF', '23' ]
      ]
      next()
    parser.end()
      
  it 'emit data event', (next) ->
    records = []
    parser = parse()
    parser.on 'data', (record) ->
      records.push record
    parser.write """
    "ABC","45"
    "DEF","23"
    """
    parser.on 'end', ->
      records.should.eql [
        [ 'ABC', '45' ]
        [ 'DEF', '23' ]
      ]
      next()
    parser.end()

  it 'ensure error in _transform is called once', (next) ->
    data = '''
     x  " a b",x "   c d"
    x " e f", x  "   g h"
    '''
    parser = parse (err, data) ->
      err.message.should.eql 'Invalid opening quote at line 1'
      next()
    parser.write chr for chr in data
    parser.end()
