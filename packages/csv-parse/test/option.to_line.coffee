
import { Readable } from 'stream'
import { finished } from 'node:stream/promises'
import { parse } from '../lib/index.js'
import { generate } from 'csv-generate'

describe 'Option `to_line`', ->
  
  it 'validation', ->
    parse '', to_line: 10, (->)
    parse '', to_line: "10", (->)
    parse '', to_line: null, (->)
    parse '', to_line: undefined, (->)
    (->
      parse '', to_line: -1, (->)
    ).should.throw 'Invalid Option: to_line must be a positive integer greater than 0, got -1'
    (->
      parse '', to_line: 0, (->)
    ).should.throw 'Invalid Option: to_line must be a positive integer greater than 0, got 0'
    (->
      parse '', to_line: "0", (->)
    ).should.throw 'Invalid Option: to_line must be a positive integer greater than 0, got "0"'
    (->
      parse '', to_line: true, (->)
    ).should.throw 'Invalid Option: to_line must be an integer, got true'
    (->
      parse '', to_line: false, (->)
    ).should.throw 'Invalid Option: to_line must be an integer, got false'
    (->
      parse '', to_line: 'oh no', (->)
    ).should.throw 'Invalid Option: to_line must be an integer, got "oh no"'

  it 'start at defined position', (next) ->
    parse """
    1,2,3
    4,5,6
    7,8,9
    """, to_line: 2, (err, records) ->
      records.should.eql [
        [ '1','2','3' ]
        [ '4','5','6' ]
      ] unless err
      next err

  it 'count headers', (next) ->
    parse """
    a,b,c
    1,2,3
    4,5,6
    7,8,9
    """, columns: true, to_line: 3, (err, records) ->
      records.should.eql [
        {a: '1',b: '2',c: '3'}
        {a: '4',b: '5',c: '6'}
      ] unless err
      next err

  it 'records with quoted line at the end of line', (next) ->
    parse """
    1,2,"
    
    3"
    4,5,"
    6"
    7,8,"
    9"
    """, to_line: 5, (err, records) ->
      records.should.eql [
        [ '1','2','\n\n3' ]
        [ '4','5','\n6' ]
      ] unless err
      next err

  it 'records with quoted line in the middle of line', (next) ->
    parse """
    1,2,"
    
    3"
    4,5,"
    6"
    7,8,"
    9"
    """, to_line: 6, (err, records) ->
      records.should.eql [
        [ '1','2','\n\n3' ]
        [ '4','5','\n6' ]
      ] unless err
      next err

  it 'not influenced by record delimiter', (next) ->
    parse """
    a,b,c:1,2,
    3:d,e,f:4,5,
    6:g,h,i:7,8,
    9
    """, to_line: 2, record_delimiter: ':', (err, records) ->
      records.should.eql [
        [ 'a','b','c' ]
        [ '1','2','\n3' ]
        [ 'd','e','f' ]
      ] unless err
      next err

  it 'resolved with `to_line`', ->
    # Prevent `Error [ERR_STREAM_PREMATURE_CLOSE]: Premature close`
    reader = new Readable
      highWaterMark: 100
      read: (size) ->
        setImmediate =>
          for i in [0...size]
            this.push "#{size},#{i}\n"
    parser = reader.pipe parse to_line: 3
    parser.on 'readable', () =>
      while parser.read() isnt null then true
    await finished parser
