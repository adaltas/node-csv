
import { stringify } from '../lib/index.js'

describe 'Option `escape_formulas`', ->
  
  it 'default to `false`', (next) ->
    stringifier = stringify [
      ['abc', 'def']
    ], ->
      stringifier.options.escape_formulas.should.be.false()
      next()
        
  it 'validation', ->
    (->
      stringify [
        ['abc', 'def']
      ], escape_formulas: 'invalid'
    ).should.throw
      code: 'CSV_OPTION_ESCAPE_FORMULAS_INVALID_TYPE'
      message: 'option `escape_formulas` must be a boolean, got "invalid"'

  it 'escape =, +, -, @, \\t, \\r and unicode equivalent signs', (next) ->
    stringify [
      [ '=a',1]
      [ '+b',2]
      [ '-c',3]
      [ '@d',4]
      [ '\te',5]
      [ '\rf',6]
      [ 'g',7]
      [ '\uFF1Dh',8]
      [ '\uFF0Bi',9]
      [ '\uFF0Dj',10]
      [ '\uFF20k',11]
      [ '\uFF0Cl',12] # \uFF0C is 'full width comma' and should not be escaped
    ], escape_formulas: true, eof: false, (err, data) ->
      return next err if err
      data.should.eql """
      '=a,1
      '+b,2
      '-c,3
      '@d,4
      '\te,5
      '\rf,6
      g,7
      '\uFF1Dh,8
      '\uFF0Bi,9
      '\uFF0Dj,10
      '\uFF20k,11
      \uFF0Cl,12
      """
      next()

  it 'with `quoted` option', (next) ->
    stringify [
      [ '=a',1]
      [ 'b',2]
    ], escape_formulas: true, quoted: true, eof: false, (err, data) ->
      return next err if err
      data.should.eql """
      "'=a","1"
      "b","2"
      """
      next()
