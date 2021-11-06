
import { parse } from '../lib/index.js'
import { assert_error } from './api.assert_error.coffee'

describe 'Option `relax_quotes`', ->
  
  it 'validation', ->
    parse '', relax_quotes: true, (->)
    parse '', relax_quotes: false, (->)
    parse '', relax_quotes: null, (->)
    parse '', relax_quotes: undefined, (->)
    (->
      parse '', relax_quotes: 1, (->)
    ).should.throw 'Invalid Option: relax_quotes must be a boolean, got 1'
    (->
      parse '', relax_quotes: 'oh no', (->)
    ).should.throw 'Invalid Option: relax_quotes must be a boolean, got "oh no"'

  it 'true with invalid quotes in the middle', (next) ->
    # try with relax_quotes true
    parse """
    384682,the "SAMAY" Hostel,Jiron Florida 285
    """, relax_quotes: true, (err, records) ->
      return next err if err
      records.should.eql [
        [ '384682', 'the "SAMAY" Hostel', 'Jiron Florida 285' ]
      ]
      next()

  it 'false with invalid quotes in the middle', (next) ->
    # try with relax_quotes false
    parse """
    384682,the "SAMAY" Hostel,Jiron Florida 285
    """, relax_quotes: false, (err) ->
      assert_error err,
        message: 'Invalid Opening Quote: a quote is found inside a field at line 1'
        code: 'INVALID_OPENING_QUOTE'
        field: 'the '
      next()

  it 'true with invalid quotes on the left', (next) ->
    parse """
    a,"b" c,d
    a,""b" c,d
    """, relax_quotes: true, (err, records) ->
      return next err if err
      records.should.eql [
        [ 'a', '"b" c', 'd' ]
        [ 'a', '""b" c', 'd' ]
      ]
      next()

  it 'false with invalid quotes on the left', (next) ->
    # transform is throwing instead of emiting error, skipping for now
    i = 0
    parse """
    a,"b" c,d
    """, relax_quotes: false, (err) ->
      assert_error err,
        message: 'Invalid Closing Quote: got " " at line 1 instead of delimiter, record delimiter, trimable character (if activated) or comment'
        code: 'CSV_INVALID_CLOSING_QUOTE'
        next()

  it 'true with two invalid quotes on the left', (next) ->
    # try with relax_quotes true
    parse """
    a,""b"" c,d
    """, relax_quotes: true, (err, records) ->
      return next err if err
      records.should.eql [
        [ 'a', '""b"" c', 'd' ]
      ] unless err
      next err

  it 'false with two invalid quotes on the left', (next) ->
    # try with relax_quotes false
    parse """
    a,""b"" c,d
    """, relax_quotes: false, (err) ->
      # Change of implementation in version 4, was
      # records.should.eql [
      #   [ 'a', '"b" c', 'd' ]
      # ] unless err
      assert_error err,
        message: 'Invalid Closing Quote: got "b" at line 1 instead of delimiter, record delimiter, trimable character (if activated) or comment'
        code: 'CSV_INVALID_CLOSING_QUOTE'
      next()

  it 'true with invalid quotes on the right', (next) ->
    # TODO: we need to decide the strategy we want here
    parse """
    a,b "c",d
    Bob"","23",e
    """, relax_quotes: true, (err, records) ->
      return next err if err
      records.should.eql [
        [ 'a', 'b "c"', 'd' ]
        [ 'Bob""', '23','e' ]
      ]
      next()

  it 'false with invalid quotes on the right', (next) ->
    parse """
    a,b "c"
    """, relax_quotes: false, (err) ->
      assert_error err,
        message: 'Invalid Opening Quote: a quote is found inside a field at line 1'
        code: 'INVALID_OPENING_QUOTE'
        field: 'b '
      next()
