
import parse from '../lib/index.js'
import {assert_error} from './api.assert_error.coffee'

describe 'Option `relax`', ->
  
  it 'validation', ->
    parse '', relax: true, (->)
    parse '', relax: false, (->)
    parse '', relax: null, (->)
    parse '', relax: undefined, (->)
    (->
      parse '', relax: 1, (->)
    ).should.throw 'Invalid Option: relax must be a boolean, got 1'
    (->
      parse '', relax: 'oh no', (->)
    ).should.throw 'Invalid Option: relax must be a boolean, got "oh no"'

  it 'true with invalid quotes in the middle', (next) ->
    # try with relax true
    parse """
    384682,the "SAMAY" Hostel,Jiron Florida 285
    """, relax: true, (err, data) ->
      return next err if err
      data.should.eql [
        [ '384682', 'the "SAMAY" Hostel', 'Jiron Florida 285' ]
      ]
      next()

  it 'false with invalid quotes in the middle', (next) ->
    # try with relax false
    parse """
    384682,the "SAMAY" Hostel,Jiron Florida 285
    """, relax: false, (err, data) ->
      assert_error err,
        message: 'Invalid Opening Quote: a quote is found inside a field at line 1'
        code: 'INVALID_OPENING_QUOTE'
        field: 'the '
      next()

  it 'true with invalid quotes on the left', (next) ->
    parse """
    a,"b" c,d
    a,""b" c,d
    """, relax: true, (err, data) ->
      return next err if err
      data.should.eql [
        [ 'a', '"b" c', 'd' ]
        [ 'a', '""b" c', 'd' ]
      ]
      next()

  it 'false with invalid quotes on the left', (next) ->
    # transform is throwing instead of emiting error, skipping for now
    i = 0
    parse """
    a,"b" c,d
    """, relax: false, (err, data) ->
      assert_error err,
        message: 'Invalid Closing Quote: got " " at line 1 instead of delimiter, record delimiter, trimable character (if activated) or comment'
        code: 'CSV_INVALID_CLOSING_QUOTE'
        next()

  it 'true with two invalid quotes on the left', (next) ->
    # try with relax true
    parse """
    a,""b"" c,d
    """, relax: true, (err, data) ->
      return next err if err
      data.should.eql [
        [ 'a', '""b"" c', 'd' ]
      ] unless err
      next err

  it 'false with two invalid quotes on the left', (next) ->
    # try with relax false
    parse """
    a,""b"" c,d
    """, relax: false, (err, data) ->
      # Change of implementation in version 4, was
      # data.should.eql [
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
    """, relax: true, (err, data) ->
      return next err if err
      data.should.eql [
        [ 'a', 'b "c"', 'd' ]
        [ 'Bob""', '23','e' ]
      ]
      next()

  it 'false with invalid quotes on the right', (next) ->
    # transform is throwing instead of emiting error, skipping for now
    parse """
    a,b "c"
    """, relax: false, (err, data) ->
      assert_error err,
        message: 'Invalid Opening Quote: a quote is found inside a field at line 1'
        code: 'INVALID_OPENING_QUOTE'
        field: 'b '
      next()
