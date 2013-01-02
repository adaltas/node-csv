
###
Test CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)
###

require 'coffee-script'
fs = require 'fs'
should = require 'should'
csv = if process.env.CSV_COV then require '../lib-cov/csv' else require '../src/csv'

describe 'header', ->
  
  it 'should print headers with defined write columns', (next) ->
    csv()
    .from.path("#{__dirname}/header/defwcols.in")
    .to.path("#{__dirname}/header/defwcols.tmp",
      header: true
      columns: ["FIELD_1", "FIELD_2"]
    )
    .on 'close', (count) ->
      count.should.eql 2
      expect = fs.readFileSync "#{__dirname}/header/defwcols.out"
      result = fs.readFileSync "#{__dirname}/header/defwcols.tmp"
      result.should.eql expect
      fs.unlink "#{__dirname}/header/defwcols.tmp"
      next()
  
  it 'should print headers with true read columns and defined write columns', (next) ->
    csv()
    .from.path("#{__dirname}/header/truercols_defwcols.in",
      columns: true
    )
    .to.path("#{__dirname}/header/truercols_defwcols.tmp",
      header: true
      columns: ["FIELD_1", "FIELD_2"]
    )
    .on 'close', (count) ->
      count.should.eql 2
      expect = fs.readFileSync "#{__dirname}/header/truercols_defwcols.out"
      result = fs.readFileSync "#{__dirname}/header/truercols_defwcols.tmp"
      result.should.eql expect
      fs.unlink "#{__dirname}/header/truercols_defwcols.tmp"
      next()

  it 'should print headers if no records to parse', (next) ->
    csv()
    .from.array([])
    .to.string((data) ->
      data.should.eql 'some,headers'
    , header: true, columns: ['some', 'headers'])
    .on 'end', (count) ->
      count.should.eql 0
      next()





