
parse = require '../src'

describe 'raw', ->
  it 'includes escape chars', (next) ->
    str = """
    "hello""world",LOL
    """
    parse str, raw: true, escape: '"', (err, data) ->
      data[0].raw.should.eql str unless err
      data[0].row.should.eql [ 'hello"world', 'LOL' ] unless err
      next err

  it 'includes line breaks', (next) ->
    parse """
    hello
    my
    friend
    """, raw: true, escape: '"', (err, data) ->
      data[1].raw.should.match /\n$/ unless err
      next err

  it 'has the inner line breaks', (next) ->
    str = """
    foo,"b
    a
    r"
    """
    parse str, raw: true, escape: '"', (err, data) ->
      data[0].raw.should.eql str unless err
      next err

  it 'preserve columns', (next) ->
    parse """
    name,last name
    Boudreau,Jonathan
    """, raw: true, columns: ['FIELD_1', false], (err, data) ->
      data[0].raw.should.eql 'name,last name\n' unless err
      data[0].row.should.eql FIELD_1: 'name' unless err
      next err
    

 
