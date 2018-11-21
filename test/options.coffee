
stringify = require '../src'

describe 'Options', ->

  it 'underscore options', ->
    stringifier = stringify recordDelimiter: ':'
    stringifier.options.record_delimiter.should.eql ':'
    (stringifier.options.recordDelimiter is undefined).should.be.true()
