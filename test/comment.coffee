
should = require 'should'
parse = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'comment', ->

  it 'skip line starting by # by default', (next) ->
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
      ]
      next()

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
      ]
      next()

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
    # csv()
    # .from.string( """
    #   abc,#,def
    #   1,2,3
    #   """ )
    # .to.string (result) ->
    #   result.should.eql """
    #   abc,#,def
    #   1,2,3
    #   """
    #   next()


