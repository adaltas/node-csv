
import * as stream from 'node:stream/promises'
import { generate } from 'csv-generate'
import { parse } from '../lib/index.js'

describe 'API stream.iterator', ->

  it 'classic', ->
    parser = generate(length: 10).pipe parse()
    records = []
    for await record from parser
      records.push record
    records.length.should.eql 10

  it 'with iteractor stoped in between', ->
    # See https://github.com/adaltas/node-csv/issues/333
    # See https://github.com/adaltas/node-csv/issues/410
    # Prevent `Error [ERR_STREAM_PREMATURE_CLOSE]: Premature close`
    records = []
    parser = generate(length: 10).pipe parse
      to_line: 2
    records = []
    for await record from parser
      records.push record
    records.length.should.eql 2
