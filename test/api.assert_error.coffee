
{CsvError} = require '..'
ResizeableBuffer = require '../lib/ResizeableBuffer'

module.exports = assert_error = (err, assert = {}, exhaustive = false) ->
  if Array.isArray err
    assert_error e, assert[i] for e, i in err
    return
  if exhaustive then for key, value of err
    assert.should.have.keys(key)
  for key, expect of assert
    value = err[key]
    if typeof expect is 'string'
      # eg, convert a buffer
      value = value.toString() if value?.toString?
      should(value).deepEqual expect
    else if expect instanceof RegExp
      should(value).match expect
    else if expect is undefined
      should(value).be.undefined()
    else if expect is null
      should(value).be.null()
    else
      should.fail()

describe 'API assert_error', ->
  
  it 'work on array', ->
    err = new CsvError 'A_MESSAGE', 'A message'
    assert_error [err, err], [
      code: 'A_MESSAGE'
      message: 'A message'
    ,
      code: 'A_MESSAGE'
      message: 'A message'
    ]
      
  it 'detect a property not in assert', ->
    err = new CsvError 'A_MESSAGE', 'A message', a_key: 'a value'
    ( ->
      assert_error err,
        code: 'A_MESSAGE'
        message: 'A message'
    ).should.throw /expected Object .* to have key a_key/
      
  it 'detect a property not in error', ->
    err = new CsvError 'A_MESSAGE', 'A message'
    ( ->
      assert_error err,
        code: 'A_MESSAGE'
        message: 'A message'
        a_key: 'a value'
    ).should.throw "expected undefined to equal 'a value'"

  it 'validate a string value', ->
    err = new CsvError 'A_MESSAGE', 'A message'
    assert_error err,
      code: 'A_MESSAGE'
      message: 'A message'
    ( ->
      assert_error err,
        code: 'A_MESSAGE'
        message: 'Another mesage'
    ).should.throw "expected 'A message' to equal 'Another mesage'"
        
  it 'validate a null value', ->
    err = new CsvError 'A_MESSAGE', 'A message'
    ( ->
      assert_error err,
        code: 'A_MESSAGE'
        message: null
    ).should.throw "expected 'A message' to be null"
        
  it 'validate a undefined value', ->
    err = new CsvError 'A_MESSAGE', 'A message'
    ( ->
      assert_error err,
        code: 'A_MESSAGE'
        message: undefined
    ).should.throw "expected 'A message' to be undefined"
        
  it 'validate a regexp value', ->
    err = new CsvError 'A_MESSAGE', 'A message'
    assert_error err,
      code: 'A_MESSAGE'
      message: /^A.*/
    ( ->
      assert_error err,
        code: 'A_MESSAGE'
        message: /^Another.*/
    ).should.throw "expected 'A message' to match /^Another.*/"
    
