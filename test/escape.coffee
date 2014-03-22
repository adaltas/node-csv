
should = require 'should'
parse = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'escape', ->

  it 'only apply to quote and escape characters', (next) ->
    parse """
    20322051544,"19""79.0",8.8017226E7,"A""B""C",45,2000-01-01
    28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
    """, escape: '"', (err, data) ->
      return next err if err
      data.should.eql [
        [ '20322051544','19"79.0','8.8017226E7','A"B"C','45','2000-01-01' ]
        [ '28392898392','1974.0','8.8392926E7','DEF','23','2050-11-27' ]
      ]
      next()

  it 'should honor the backslash escape charactere', (next) ->
    parse """
    20322051544,"19\\"79.0",8.8017226E7,"A\\"B\\"C",45,2000-01-01
    28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
    """, escape: '\\', (err, data) ->
      return next err if err
      data.should.eql [
        [ '20322051544','19\"79.0','8.8017226E7','A\"B\"C','45','2000-01-01' ]
        [ '28392898392','1974.0','8.8392926E7','DEF','23','2050-11-27' ]
      ]
      next()

  it 'if next char is not in the current chunk', (next) ->
    data = []
    parser = parse escape: '\\'
    parser.on 'readable', ->
      while d = parser.read()
        data.push d
    parser.on 'finish', ->
      data.should.eql [
        [ 'field with " inside' ]
      ]
      next()
    parser.write '"field with \\'
    parser.write '" inside"'
    parser.end()






