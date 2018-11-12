
parse = require '../lib'

describe 'properties lines_count', ->

  it 'adds up with default settings', (next) ->
    parser = parse()
    parser.on 'data', -> while this.read() then null
    parser.on 'end', ->
      this.info.lines.should.eql(this.info.records + this.info.empty_lines + this.info.skipped_lines)
      next()
    parser.write 'ABC\n\nDEF'
    parser.end()

  it 'displays no skipped lines when not skip_empty_lines', (next) ->
    parser = parse skip_empty_lines: false
    parser.on 'readable', ->
      records = []
      while record = this.read()
        records.push(record)
    parser.on 'error', (err) ->
      err.message.should.eql 'Invalid Record Length: expect 1, got 6 on line 2'
      this.info.empty_lines.should.eql(0)
      this.info.skipped_lines.should.eql(0)
      this.info.lines.should.eql(2)
      next()
    parser.on 'end', ->
      next()
    parser.write  """

    20322051544,1979,8.8017226E7,ABC,45,2000-01-01

    28392898392,1974,8.8392926E7,DEF,23,2050-11-27

    """
    parser.end()

  it 'counts skipped lines', (next) ->
    parser = parse relax_column_count: true, skip_empty_lines: true
    parser.on 'data', -> while this.read() then null
    parser.on 'error', (err) ->
      next(err)
    parser.on 'end', ->
      this.info.lines.should.eql(this.info.records + this.info.empty_lines)
      this.info.empty_lines.should.eql(2)
      this.info.skipped_lines.should.eql(1)
      next()
    parser.write """
    20322051544,1979,8.8017226E7,ABC,45,2000-01-01
    
    28392898392,1974,8.8392926E7,DEF,23,2050-11-27,42
    
    28392898392,1974,8.8392926E7,GHI,23,2050-11-27
    """
    parser.end()
