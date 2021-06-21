
parse = require '../lib'

describe 'Option `delimiter`', ->
  
  it 'validation', ->
    parse '', delimiter: ',', (->)
    parse '', delimiter: Buffer.from(','), (->)
    (->
      parse '', delimiter: '', (->)
    ).should.throw
      message: 'Invalid option delimiter: delimiter must be a non empty string or buffer or array of string|buffer, got ""'
      code: 'CSV_INVALID_OPTION_DELIMITER'
    (->
      parse '', delimiter: Buffer.from(''), (->)
    ).should.throw
      message: 'Invalid option delimiter: delimiter must be a non empty string or buffer or array of string|buffer, got {"type":"Buffer","data":[]}'
      code: 'CSV_INVALID_OPTION_DELIMITER'
    (->
      parse '', delimiter: true, (->)
    ).should.throw
      message: 'Invalid option delimiter: delimiter must be a non empty string or buffer or array of string|buffer, got true'
      code: 'CSV_INVALID_OPTION_DELIMITER'
    (->
      parse '', delimiter: [], (->)
    ).should.throw
      message: 'Invalid option delimiter: delimiter must be a non empty string or buffer or array of string|buffer, got []'
      code: 'CSV_INVALID_OPTION_DELIMITER'
    (->
      parse '', delimiter: [''], (->)
    ).should.throw
      message: 'Invalid option delimiter: delimiter must be a non empty string or buffer or array of string|buffer, got [""]'
      code: 'CSV_INVALID_OPTION_DELIMITER'
    (->
      parse '', delimiter: [',',''], (->)
    ).should.throw
      message: 'Invalid option delimiter: delimiter must be a non empty string or buffer or array of string|buffer, got [",",""]'
      code: 'CSV_INVALID_OPTION_DELIMITER'
  
  it 'is compatible with buffer size', (next) ->
    parser = parse delimiter: [':::'], (err, data) ->
      data.should.eql [
        [ '1', '2', '3' ]
        [ 'b', 'c', 'd' ]
      ]
      next err
    parser.write c for c in """
    1:::2:::3
    b:::c:::d
    """
    parser.end()
  
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
  
  it 'using array of a single delimiter', (next) ->
    parse """
    abc,,123,
    ,def,,
    """, delimiter: [','], (err, data) ->
      return next err if err
      data.should.eql [
        [ 'abc','','123','']
        [ '','def','','']
      ]
      next()
  
  it 'using array of a single delimiter of multiple characters', (next) ->
    parse """
    !#
    !#
    """, delimiter: ['!#'], (err, data) ->
      return next err if err
      data.should.eql [
        [ '', '']
        [ '', '']
      ]
      next()
  
  it 'using array of a multiple delimiters of variable length', (next) ->
    parse """
    abc,;;123;;
    ;;def;;,
    """, delimiter: [',', ';;'], (err, data) ->
      return next err if err
      data.should.eql [
        [ 'abc','','123','']
        [ '','def','','']
      ]
      next()
