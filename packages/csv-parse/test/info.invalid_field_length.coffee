
import { parse } from '../lib/index.js'

describe 'info invalid_field_length', ->

  it 'with relax_column_count', (next) ->
    parse '''
    a,b,c
    d,e
    f,g,h
    i,j
    ''',
      relax_column_count: true
    , (err, data, {invalid_field_length}) ->
      data.length.should.eql 4
      invalid_field_length.should.eql 2
      next()

  it 'with relax_column_count and skip_empty_lines', (next) ->
    parser = parse '''
    a,b,c
    
    d,e,f
    
    h,i
    ''',
      relax_column_count: true
      skip_empty_lines: true
    , (err, data, {empty_lines, invalid_field_length, records})->
      empty_lines.should.eql 2
      invalid_field_length.should.eql 1
      records.should.eql 3
      next()
