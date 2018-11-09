
parse = require '../lib'

describe 'options escape', ->
  
  describe 'same as quote', ->

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
          
  describe 'different than quote', ->

    it 'apply to quote char', (next) ->
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

    it 'apply to escape char', (next) ->
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

    it 'does not apply outside quoted field', (next) ->
      parse '''
      aa,b1\\\\b2,c\\\\d\\\\e
      f\\\\g,h,i1\\\\i2
      ''', escape: '\\', (err, data) ->
        return next err if err
        data.should.eql [
          [ 'aa','b1\\\\b2','c\\\\d\\\\e' ]
          [ 'f\\\\g','h','i1\\\\i2' ]
        ]
        next()

    it 'handle non continuous chunks', (next) ->
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
