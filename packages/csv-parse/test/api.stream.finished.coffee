
import * as stream from 'node:stream/promises'
import { Readable } from 'stream'
import { generate } from 'csv-generate'
import { parse } from '../lib/index.js'

describe 'API stream.finished', ->

  it 'resolved at the end', ->
    # See https://github.com/adaltas/node-csv/issues/333
    records = []
    parser = generate(length: 10).pipe parse()
    parser.on 'readable', () =>
      while (record = parser.read()) isnt null
        records.push record
    await stream.finished parser
    records.length.should.eql 10

  it 'resolved with `to_line`', ->
    # See https://github.com/adaltas/node-csv/issues/333
    records = []
    parser = generate(length: 10).pipe parse to_line: 3
    parser.on 'readable', () =>
      while (record = parser.read()) isnt null
        records.push record
    await stream.finished parser
    records.length.should.eql 3

  it 'rejected on error', ->
    parser = parse to_line: 3
    parser.write 'a,b,c\n'
    parser.write 'd,e,f\n'
    parser.write 'h,i,j,ohno\n'
    parser.write 'k,l,m\n'
    parser.end()
    parser.on 'readable', () =>
      while (record = parser.read()) isnt null then true
    stream
    .finished parser
    .should.be.rejectedWith
      code: 'CSV_RECORD_INCONSISTENT_FIELDS_LENGTH'
