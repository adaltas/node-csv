
import { parse } from '../lib/index.js'

describe 'Option `to`', ->
  
  it 'validation', ->
    parse '', to: 10, (->)
    parse '', to: "10", (->)
    (->
      parse '', to: -1, (->)
    ).should.throw 'Invalid Option: to must be a positive integer greater than 0, got -1'
    (->
      parse '', to: 0, (->)
    ).should.throw 'Invalid Option: to must be a positive integer greater than 0, got 0'
    (->
      parse '', to: '0', (->)
    ).should.throw 'Invalid Option: to must be a positive integer greater than 0, got "0"'
    (->
      parse '', to: true, (->)
    ).should.throw 'Invalid Option: to must be an integer, got true'
    (->
      parse '', to: false, (->)
    ).should.throw 'Invalid Option: to must be an integer, got false'
    (->
      parse '', to: 'oh no', (->)
    ).should.throw 'Invalid Option: to must be an integer, got "oh no"'

  it 'start at defined position', (next) ->
    parse """
    1,2,3
    4,5,6
    7,8,9
    """, to: 2, (err, data) ->
      return next err if err
      data.should.eql [
        [ '1','2','3' ]
        [ '4','5','6' ]
      ]
      next()

  it 'dont count headers', (next) ->
    parse """
    a,b,c
    1,2,3
    4,5,6
    7,8,9
    """, columns: true, to: 2, (err, data) ->
      return next err if err
      data.should.eql [
        {a:'1',b:'2',c:'3'}
        {a:'4',b:'5',c:'6'}
      ]
      next()

  it 'end stream when "to" is reached, further lines are not parsed', (next) ->
    parse """
    1,2,3
    4,5,6
    7,8
    """, to: 2, (err, data) ->
      return next err if err
      data.should.eql [
        [ '1','2','3' ]
        [ '4','5','6' ]
      ]
      next()

  it 'not influenced by lines', (next) ->
    parse """
    1,2,"
    3"
    4,5,"
    6"
    7,8,"
    9"
    """, to: 2, (err, data) ->
      data.should.eql [
        [ '1','2','\n3' ]
        [ '4','5','\n6' ]
      ] unless err
      next err

  it 'not influenced by record delimiter', (next) ->
    parse """
    1,2,3:4,5,6:7,8,9
    """, to: 2, record_delimiter: ':', (err, data) ->
      data.should.eql [
        [ '1','2','3' ]
        [ '4','5','6' ]
      ] unless err
      next err
