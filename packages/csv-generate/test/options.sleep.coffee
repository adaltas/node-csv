
import { generate } from '../lib/index.js'

describe 'Option `sleep`', ->

  it 'as integer above 0', (next) ->
    @timeout 10000
    generate duration: 1000, sleep: 100, objectMode: true, (err, data) ->
      data.length.should.be.within(8, 12) unless err
      next err

  it 'sleep combined with length and objectMode false', (next) ->
    # Fix bug where chuncks where emited after end when sleep is activated
    @timeout 10000
    records = []
    generate
      objectMode: false
      length: 2
      sleep: 10
    .on 'readable', ->
      while (record = this.read()) isnt null
        records.push record.toString()
    .on 'error', next
    .on 'end', ->
      records.join().split('\n').length.should.eql 2
      next()
