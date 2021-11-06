
import { parse } from '../lib/index.js'

describe 'properties count records', ->
  
  it 'without any options', (next) ->
    parser = parse """
    a,b,c
    d,e,f
    g,h,i
    """, (err) ->
      parser.info.records.should.eql 3 unless err
      next err
  
  it 'with "column" option', (next) ->
    parser = parse """
    1,2,3
    d,e,f
    g,h,i
    j,k,l
    m,n,o
    """, columns: true, (err) ->
      parser.info.records.should.eql 4 unless err
      next err
  
