
parse = require '../lib'

describe 'Option `max_record_size`', ->
  
  it 'validation', ->
    parse '', max_record_size: 10, (->)
    parse '', max_record_size: "10", (->)
    (->
      parse '', max_record_size: -1, (->)
    ).should.throw 'Invalid Option: max_record_size must be a positive integer, got -1'
    (->
      parse '', max_record_size: true, (->)
    ).should.throw 'Invalid Option: max_record_size must be a positive integer, got true'
    (->
      parse '', max_record_size: 'oh no', (->)
    ).should.throw 'Invalid Option: max_record_size must be a positive integer, got "oh no"'

  it 'field exceed limit', (next) ->
    parse '''
    12,34,56
    ab,cd,ef
    hi,xxxxxxxxxxxxxxx,jk
    lm,no,pq
    ''', max_record_size: 10, (err) ->
      err.message.should.eql 'Max Record Size: record exceed the maximum number of tolerated bytes of 10 on line 3'
      next()
