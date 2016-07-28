
require 'should'
parse = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'raw', ->
  it 'includes escape chars', ->
    str = """
    "hello""world",LOL
    """
    parse str, escape: '"', (err, data) ->
      data[0].raw.should.eql str

  it 'includes line breaks', ->
    parse """
    hello
    my
    friend
    """, escape: '"', (err, data) ->
      data[1].raw.should.match /\n$/

  it 'skips columns', ->
    parse """
    name,last name
    Boudreau,Jonathan
    """, {}, (err, data) ->
      data[0].raw.should.not.contain 'name'

  it 'has the inner line breaks', ->
    str = """
    foo,"b
    a
    r"
    """
    parse str, escape: '"', (err, data) ->
      data[0].raw.should.eql str
    

 
