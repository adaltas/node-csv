
parse = require '../lib'

describe 'Option `delimiter`', ->
  
  it 'validation', ->
    parse '', delimiter: ',', (->)
    parse '', delimiter: Buffer.from(','), (->)
    (->
      parse '', delimiter: '', (->)
    ).should.throw 'Invalid Option: delimiter must be a non empty string'
    (->
      parse '', delimiter: Buffer.from(''), (->)
    ).should.throw 'Invalid Option: delimiter must be a non empty buffer'
    (->
      parse '', delimiter: true, (->)
    ).should.throw 'Invalid Option: delimiter must be a string or a buffer, got true'
  
  it 'using default comma', (next) ->
    parse """
    abc,,123,
    ,def,,
    """, (err, data) ->
      return next err if err
      data.should.eql [
        [ 'abc','','123','']
        [ '','def','','']
      ]
      next()
  
  it 'using tab', (next) ->
    parse """
    abc\t\tde\tf\t
    \thij\tklm\t\t
    """, delimiter: '\t', (err, data) ->
      return next err if err
      data.should.eql [
        [ 'abc','','de','f','']
        [ '','hij','klm','','']
      ]
      next()
  
  it 'multiple chars empty fields only', (next) ->
    parse """
    !#
    !#
    """, delimiter: '!#', (err, data) ->
      return next err if err
      data.should.eql [
        [ '', '']
        [ '', '']
      ]
      next()
  
  it 'multiple chars mixed fields', (next) ->
    parse """
    20322051544!#!#8.8017226E7!#45!#
    !#1974!#8.8392926E7!#!#
    """, delimiter: '!#', (err, data) ->
      return next err if err
      data.should.eql [
        [ '20322051544','','8.8017226E7','45','']
        [ '','1974','8.8392926E7','','']
      ]
      next()
