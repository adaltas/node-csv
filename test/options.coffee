
stringify = require '../src'

describe 'Options', ->

  it 'underscore options', ->
    stringifier = stringify rowDelimiter: ':'
    stringifier.options.row_delimiter.should.eql ':'
    (stringifier.options.rowDelimiter is undefined).should.be.true()
