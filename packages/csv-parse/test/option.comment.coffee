
import { parse } from '../lib/index.js'

describe 'Option `comment`', ->
  
  it 'validation', ->
    parse '', comment: undefined, (->)
    parse '', comment: null, (->)
    parse '', comment: false, (->)
    parse '', comment: '', (->)
    (->
      parse '', comment: true, (->)
    ).should.throw
      message: 'Invalid option comment: comment must be a buffer or a string, got true'
      code: 'CSV_INVALID_OPTION_COMMENT'
    (->
      parse '', comment: 2, (->)
    ).should.throw
      message: 'Invalid option comment: comment must be a buffer or a string, got 2'
      code: 'CSV_INVALID_OPTION_COMMENT'

  it 'single comment line', (next) ->
    parse '# comment', comment: '#', (err, data) ->
      data.length.should.eql 0
      next err

  it 'single comment line with empty field', (next) ->
    parse '""# comment', comment: '#', (err, data) ->
      data.should.eql [['']]
      next err

  it 'skip line starting by single comment char', (next) ->
    parse """
    # skip this
    "ABC","45"
    "DEF","23"
    # and this
    "GHI","94"
    # as well as that
    """, comment: '#', (err, data) ->
      data.should.eql [
        [ 'ABC','45' ]
        [ 'DEF','23' ]
        [ 'GHI','94' ]
      ] unless err
      next err
  
  it 'doent apply inside quotes', (next) ->
    parse """
      "ABC","45"
      "D#noEF","23"#yes
      "GHI","94"
      """, comment: '#', (err, data) ->
      data.should.eql [
        [ 'ABC','45' ]
        [ 'D#noEF','23' ]
        [ 'GHI','94' ]
      ] unless err
      next err
  
  it 'is cancel if empty', (next) ->
    parse """
    abc,#,def
    1,2,3
    """, comment: '', (err, data) ->
      data.should.eql [
        [ 'abc','#','def' ]
        [ '1','2', '3' ]
      ]
      next()
  
  it 'is cancel by default', (next) ->
    parse """
    abc,#,def
    1,2,3
    """, (err, data) ->
      data.should.eql [
        [ 'abc','#','def' ]
        [ '1','2', '3' ]
      ]
      next()
  
  it 'accept multiple characters', (next) ->
    parser = parse comment: '//', (err, data) ->
      data.should.eql [
        [ 'abc','def' ]
        [ '1','2' ]
      ]
      next()
    data = """
    abc,def
    // a comment
    1,2
    """
    parser.write char for char in data
    parser.end()
  
  it 'accept quotes', (next) ->
    parse """
    "Alaska","Site1","Rack1","RTU-1","192.168.1.3"
    # Contains double-quote: "
    """,
      comment: "#"
    , (err, content) ->
      next err
