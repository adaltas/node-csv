
import { parse } from '../lib/index.js'

describe 'Option `raw`', ->
  
  it 'validation', ->
    parse '', raw: undefined, (->)
    parse '', raw: null, (->)
    parse '', raw: false, (->)
    (->
      parse '', raw: '', (->)
    ).should.throw 'Invalid Option: raw must be true, got ""'
    (->
      parse '', raw: 2, (->)
    ).should.throw 'Invalid Option: raw must be true, got 2'

  it 'includes escape chars', (next) ->
    str = """
    "hello""world",LOL
    """
    parse str, raw: true, escape: '"', (err, data) ->
      data[0].raw.should.eql str unless err
      data[0].record.should.eql [ 'hello"world', 'LOL' ] unless err
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
      data[0].record.should.eql FIELD_1: 'name' unless err
      next err
    

 
