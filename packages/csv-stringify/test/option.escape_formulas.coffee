
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

  it 'escape =, +, -, @, \\t, \\r signs', (next) ->
    stringify [
      [ '=a',1]
      [ '+b',2]
      [ '-c',3]
      [ '@d',4]
      [ '\te',5]
      [ '\rf',6]
      [ 'g',7]
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
