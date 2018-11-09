
fs = require 'fs'
parse = require '../lib'

describe 'options `max_record_size`', ->

  it 'field exceed limit', (next) ->
    parse '''
    12,34,56
    ab,cd,ef
    hi,xxxxxxxxxxxxxxx,jk
    lm,no,pq
    ''', max_record_size: 10, (err) ->
      err.message.should.eql 'Max Record Size: record exceed the maximum number of tolerated bytes of 10 on line 3'
      next()
