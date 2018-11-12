
parse = require '../lib'

describe 'API info', ->

  it 'is exported in the callback', (next) ->
    parser = parse '''
    1,2,3
    a,b,c
    ''', (err, data, info) ->
      info.should.eql
        empty_lines: 0
        lines: 2
        skipped_line_count: 0
        records: 2
      next()
