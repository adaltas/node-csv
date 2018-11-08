
parse = require '../src'

describe 'options escape', ->

  it 'is same as quote', (next) ->
    parse '''
    aa,"b1""b2","c""d""e"
    "f""g",h,"i1""i2"
    ''', escape: '"', (err, data) ->
      return next err if err
      data.should.eql [
        [ 'aa','b1"b2','c"d"e' ]
        [ 'f"g','h','i1"i2' ]
      ]
      next()

  it 'is different than quote and apply to quote char', (next) ->
    parse '''
    aa,"b1\\"b2","c\\"d\\"e"
    "f\\"g",h,"i1\\"i2"
    ''', escape: '\\', (err, data) ->
      return next err if err
      data.should.eql [
        [ 'aa','b1"b2','c"d"e' ]
        [ 'f"g','h','i1"i2' ]
      ]
      next()

  it 'is different than quote and apply to escape char', (next) ->
    parse '''
    aa,"b1\\\\b2","c\\\\d\\\\e"
    "f\\\\g",h,"i1\\\\i2"
    ''', escape: '\\', (err, data) ->
      return next err if err
      data.should.eql [
        [ 'aa','b1\\b2','c\\d\\e' ]
        [ 'f\\g','h','i1\\i2' ]
      ]
      next()

  it 'is different than quote and apply to escape char outside quoted field', (next) ->
    parse '''
    aa,b1\\\\b2,c\\\\d\\\\e
    f\\\\g,h,i1\\\\i2
    ''', escape: '\\', (err, data) ->
      return next err if err
      data.should.eql [
        [ 'aa','b1\\b2','c\\d\\e' ]
        [ 'f\\g','h','i1\\i2' ]
      ]
      next()

  it 'if next char is not in the current chunk', (next) ->
    data = []
    parser = parse escape: '\\'
    parser.on 'readable', ->
      while d = parser.read()
        data.push d
    parser.on 'end', ->
      data.should.eql [
        [ 'abc " def' ]
      ]
      next()
    parser.write chr for chr in '''
      "abc \\" def"
      '''
    parser.end()
