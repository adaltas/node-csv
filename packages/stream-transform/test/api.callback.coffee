
import generate from 'csv-generate'
import transform from '../lib/index.js'

describe 'api.callback', ->

  it 'input is data', (next) ->
    data = for i in [0...100] then i
    transform data, ((record) -> value: record), (err, result) ->
      result.length.should.eql 100 unless err
      result[0].should.eql value: 0 unless err
      next err

  it 'input is a readable stream', (next) ->
    generate length: 1000, objectMode: true, seed: 1, columns: 2
    .pipe transform ((record) -> value: record), (err, result) ->
      result.length.should.eql 1000 unless err
      result[0].should.eql value: [ 'OMH', 'ONKCHhJmjadoA' ] unless err
      next err
      
    
    
    
