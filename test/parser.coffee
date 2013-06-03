
###
Test CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)
###

fs = require 'fs'
should = require 'should'
csv = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'parser', ->

  it 'should handle empty lines', (next) ->
      count = 0
      csv()
      .from.string("""
        
        20322051544,1979,8.8017226E7,ABC,45,2000-01-01

        28392898392,1974,8.8392926E7,DEF,23,2050-11-27

        """)
      .parser
      .on 'row', (record) ->
        if count is 0
          record.should.eql ['20322051544', '1979', '8.8017226E7', 'ABC', '45', '2000-01-01']
        else if count is 1
          record.should.eql ['28392898392', '1974', '8.8392926E7', 'DEF', '23', '2050-11-27']
        else
          throw new Error "Invalid record: #{JSON.stringify(record)}"
        count++
        record
      .on 'error', (err) ->
        next err
      .on 'end', ->
        count.should.eql 2
        next()

  describe 'relax', ->

    it 'work around invalid quotes', (next) ->
      csv()
      .from.string("""
        384682,"SAMAY" Hostel,Jiron "Florida 285"
        """, quote: '"', escape: '"', relax: true)
      .to.array (data) ->
        data.should.eql [ [ '384682', 'SAMAY Hostel', 'Jiron "Florida 285"' ] ]
        next()

