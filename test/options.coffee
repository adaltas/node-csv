
parse = require '../lib'

describe 'Options', ->

  it 'are cloned', (next) ->
    options = quote: false
    parse """
    FIELD_1,FIELD_2
    20322051544,1979
    28392898392,1974
    """, options, (err, data) ->
      return next err if err
      (options.quote is false).should.be.true()
      next()
  
  it 'underscore options', ->
    parser = parse recordDelimiter: ':'
    parser.options.record_delimiter.toString().should.eql ':'
    (parser.options.recordDelimiter is undefined).should.be.true()
