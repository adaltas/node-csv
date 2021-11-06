
import { parse } from '../lib/index.js'

describe 'Option `skip_records_with_empty_values`', ->
  
  it 'validation', ->
    parse '', skip_records_with_empty_values: true, (->)
    parse '', skip_records_with_empty_values: false, (->)
    parse '', skip_records_with_empty_values: null, (->)
    parse '', skip_records_with_empty_values: undefined, (->)
    (->
      parse '', skip_records_with_empty_values: 1, (->)
    ).should.throw 'Invalid Option: skip_records_with_empty_values must be a boolean, got 1'
    (->
      parse '', skip_records_with_empty_values: 'oh no', (->)
    ).should.throw 'Invalid Option: skip_records_with_empty_values must be a boolean, got "oh no"'
  
  it 'dont skip by default', (next) ->
    parse """
    ABC,DEF
    ,
    IJK,LMN
    """, (err, records) ->
      return next err if err
      records.should.eql [
        [ 'ABC', 'DEF' ]
        [ '', '' ]
        [ 'IJK', 'LMN' ]
      ]
      next()
  
  it 'skip', (next) ->
    parse """
    ABC,DEF
    ,
    IJK,LMN
    ,
    """, skip_records_with_empty_values: true, (err, records) ->
      return next err if err
      records.should.eql [
        [ 'ABC', 'DEF' ]
        [ 'IJK', 'LMN' ]
      ]
      next()
  
  it 'skip space and tabs', (next) ->
    parse """
    ABC,DEF
    \t , \t
    IJK,LMN
    \t , \t
    """, skip_records_with_empty_values: true, (err, records) ->
      return next err if err
      records.should.eql [
        [ 'ABC', 'DEF' ]
        [ 'IJK', 'LMN' ]
      ]
      next()
  
  it 'handle value which are casted to another type than string', (next) ->
    parse """
    empty_buffer
    boolean
    integer
    null
    undefined
    """,
      skip_records_with_empty_values: true
      cast: (value) ->
        switch value
          when 'empty_buffer' then Buffer.from ''
          when 'boolean' then true
          when 'integer' then 0
          when 'null' then null
          when 'undefined' then undefined
          else value
    , (err, records) ->
      return next err if err
      records.should.eql [
        [ true ]
        [ 0 ]
      ]
      next()
