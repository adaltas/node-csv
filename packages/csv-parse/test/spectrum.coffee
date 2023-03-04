
import { default as spectrum } from 'csv-spectrum'
import { default as each } from 'each'
import { parse } from '../lib/sync.js'

describe 'spectrum', ->

  it 'pass all tests', (next) ->
    spectrum (err, tests) ->
      each tests, (test) ->
        return if test.name is 'simple' # See https://github.com/maxogden/csv-spectrum/commit/ec45e96a79661d7bd87f6becbb845b30f11accde
        records = parse test.csv.toString(), columns: true
        records.should.eql JSON.parse test.json.toString()
      .then (-> next()), next
