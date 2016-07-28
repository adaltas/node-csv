
should = require 'should'
parse = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'count records', ->
  
  it 'without any options', (next) ->
    parser = parse """
    a,b,c
    d,e,f
    g,h,i
    """, (err, data) ->
      parser.count.should.eql 3
      next()
  
  it 'with "column" option', (next) ->
    parser = parse """
    1,2,3
    d,e,f
    g,h,i
    j,k,l
    m,n,o
    """, columns: true, (err, data) ->
      parser.count.should.eql 4
      next()
  