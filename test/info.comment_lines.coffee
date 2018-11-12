
parse = require '../lib'

describe 'properties comment_lines', ->

  it 'no empty lines', (next) ->
    parse '''
    a,b,c
    d,e,f
    ''', comment: '#', (err, data, {comment_lines}) ->
      comment_lines.should.eql 0 unless err
      next err

  it 'comment in the middle of a line', (next) ->
    parse '''
    a,b,c
    d,e,f # comment
    h,i,j
    ''', comment: '#', (err, data, {comment_lines}) ->
      comment_lines.should.eql 0 unless err
      next err

  it 'single comment line', (next) ->
    parse '# comment', comment: '#', (err, data, {comment_lines}) ->
      comment_lines.should.eql 1 unless err
      next err

  it 'single comment line with empty field', (next) ->
    parse '""# comment', comment: '#', (err, data, {comment_lines}) ->
      comment_lines.should.eql 0 unless err
      next err

  it 'two line in the middle of dataset', (next) ->
    parse '''
    a,b,c
    # comment 1
    # comment 2
    d,e,f
    ''', comment: '#', skip_empty_lines: true, (err, data, {comment_lines}) ->
      comment_lines.should.eql 2 unless err
      next err

  it 'one line at the end of dataset', (next) ->
    parse '''
    a,b,c
    d,e,f
    # comment
    ''', comment: '#', (err, data, {comment_lines}) ->
      comment_lines.should.eql 1 unless err
      next err

  it 'one line a the begining', (next) ->
    parse '''
    # comment
    a,b,c
    d,e,f
    ''', comment: '#', (err, data, {comment_lines}) ->
      comment_lines.should.eql 1 unless err
      next err
