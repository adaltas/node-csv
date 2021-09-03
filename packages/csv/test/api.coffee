
import {generate, parse, stringify, transform} from '../lib/index.js'

describe 'api', ->

  it 'generate', (next) ->
    generate length: 1, columns: 1, seed: 1, encoding: 'utf8', (err, data) ->
      data.should.eql 'OMH' unless err
      next err

  it 'parse', (next) ->
    parse 'abc,def', (err, data) ->
      data.should.eql [ [ 'abc', 'def' ] ] unless err
      next err

  it 'stringify', (next) ->
    stringify [ [ 'abc', 'def' ] ], (err, data) ->
      data.should.eql 'abc,def\n' unless err
      next err

  it 'transform', (next) ->
    transform [
      ['abc','def']
    ], (record) ->
      record.push(record.shift())
      record
    , (err, output) ->
      output.should.eql [
        [ 'def', 'abc' ]
      ] unless err
      next err
    
