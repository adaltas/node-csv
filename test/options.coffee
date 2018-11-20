
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
  
  it 'camelize options', ->
    parser = parse record_delimiter: ':'
    parser.options.recordDelimiter.toString().should.eql ':'
    (parser.options.record_delimiter is undefined).should.be.true()
