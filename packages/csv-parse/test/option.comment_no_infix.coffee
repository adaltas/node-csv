
import { parse } from '../lib/index.js'

describe 'Option `comment_no_infix`', ->
  
  it 'validation', ->
    parse '', comment_no_infix: undefined, (->)
    parse '', comment_no_infix: null, (->)
    parse '', comment_no_infix: false, (->)
    parse '', comment_no_infix: true, (->)
    (->
      parse '', comment_no_infix: '', (->)
    ).should.throw
      message: 'Invalid option comment_no_infix: value must be a boolean, got ""'
      code: 'CSV_INVALID_OPTION_COMMENT'
    (->
      parse '', comment_no_infix: 2, (->)
    ).should.throw
      message: 'Invalid option comment_no_infix: value must be a boolean, got 2'
      code: 'CSV_INVALID_OPTION_COMMENT'
      
  it 'with `true`, field starting with comment', (next) ->
    parse '''
    a,#,c
    ''', comment: '#', comment_no_infix: true, (err, records) ->
      records.should.eql [
        ['a', '#', 'c']
      ] unless err
      next err
      
  it 'with `true`, field not starting with comment', (next) ->
    parse '''
    a,b#,c
    ''', comment: '#', comment_no_infix: true, (err, records) ->
      records.should.eql [
        ['a', 'b#', 'c']
      ] unless err
      next err
      
  it 'with `false`', (next) ->
    parse '''
    a,b#,c
    ''', comment: '#', comment_no_infix: false, (err, records) ->
      records.should.eql [
        ['a', 'b']
      ] unless err
      next err
