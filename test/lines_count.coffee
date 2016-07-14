
should = require 'should'
parse = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'number of lines', ->

  it 'adds up with default settings', (next) ->
    parser = parse()
    parser.on 'finish', ->
      this.lines.should.eql(this.count + this.empty_line_count + this.skipped_line_count)
      next()
    parser.write 'ABC\n\nDEF'
    parser.end()

  it 'displays no skipped lines when not skip_empty_lines', (next) ->
    parser = parse '', skip_empty_lines: false
    parser.on 'error', (err) ->
      err.message.should.eql('Number of columns is inconsistent on line 2')
      this.empty_line_count.should.eql(1)
      this.skipped_line_count.should.eql(0)
      this.lines.should.eql(2)
      next()
    parser.write  """

    20322051544,1979,8.8017226E7,ABC,45,2000-01-01

    28392898392,1974,8.8392926E7,DEF,23,2050-11-27

    """

  it 'counts skipped lines', (next) ->
    parser = parse '', relax_column_count: false
    parser.on 'error', (err) ->
      next(err)
    parser.on 'finish', ->
      console.log this.lines, "="
      console.log this.count
      console.log this.skipped_line_count
      console.log this.empty_line_count
      console.log 'header', this.header_count

      this.lines.should.eql(this.count + this.empty_line_count + this.skipped_line_count)
      this.skipped_line_count.should.eql(3)
      next()
    parser.write """
    20322051544,1979,8.8017226E7,ABC,45,2000-01-01

    28392898392,1974,8.8392926E7,DEF,23,2050-11-27
    
    28392898392,1974,8.8392926E7,GHI,23,2050-11-27
    """
