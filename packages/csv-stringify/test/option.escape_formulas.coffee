
import { stringify } from '../lib/index.js'

describe 'Option `escape_formulas`', ->

  it 'should escape =,+,-,@,\t,\r signs', (next) ->
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

  it 'should first escape_formulas, then quoted', (next) ->
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
