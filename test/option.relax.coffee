
parse = require '../lib'

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
      err.message.should.eql 'Invalid opening quote at line 1'
      next()

  it 'true with invalid quotes on the left', (next) ->
    # try with relax true
    # parse """
    # 384682,"SAMAY" Hostel,Jiron Florida 285
    # """, relax: true, (err, data) ->
    #   return next err if err
    #   data.should.eql [
    #     [ '384682', '"SAMAY" Hostel', 'Jiron Florida 285' ]
    #   ]
    #   next()
    parse """
    a,"b" c,d
    """, relax: true, (err, data) ->
      return next err if err
      data.should.eql [
        [ 'a', '"b" c', 'd' ]
      ]
      next()

  it 'false with invalid quotes on the left', (next) ->
    # transform is throwing instead of emiting error, skipping for now
    i = 0
    parse """
    384682,"SAMAY" Hostel,Jiron Florida 285
    """, relax: false, (err, data) ->
      err.message.should.eql 'Invalid Closing Quote: got " " at line 1 instead of delimiter, row delimiter, trimable character (if activated) or comment'
      next()

  it 'true with two invalid quotes on the left', (next) ->
    # try with relax true
    parse """
    384682,""SAMAY"" Hostel,Jiron Florida 285
    """, relax: true, (err, data) ->
      return next err if err
      data.should.eql [
        [ '384682', '""SAMAY"" Hostel', 'Jiron Florida 285' ]
      ] unless err
      next err

  it 'false with two invalid quotes on the left', (next) ->
    # try with relax false
    parse """
    384682,""SAMAY"" Hostel,Jiron Florida 285
    """, relax: false, (err, data) ->
      # Change of implementation in version 4, was
      err.message.should.eql 'Invalid Closing Quote: got "S" at line 1 instead of delimiter, row delimiter, trimable character (if activated) or comment'
      # data.should.eql [
      #   [ '384682', '"SAMAY" Hostel', 'Jiron Florida 285' ]
      # ] unless err
      next()

  it 'true with invalid quotes on the right', (next) ->
    # TODO: we need to decide the strategy we want here
    parse """
    384682,SAMAY Hostel,Jiron "Florida 285"
    """, relax: true, (err, data) ->
      return next err if err
      data.should.eql [
        [ '384682', 'SAMAY Hostel', 'Jiron "Florida 285"' ]
      ]
      next()

  it 'false with invalid quotes on the right', (next) ->
    # transform is throwing instead of emiting error, skipping for now
    parse """
    384682,SAMAY Hostel,Jiron "Florida 285"
    """, relax: false, (err, data) ->
      err.message.should.eql 'Invalid opening quote at line 1'
      next()
