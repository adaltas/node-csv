
import generate from '../lib/index.js'

describe 'option max_word_length', ->

  it 'default to 16', (next) ->
    @timeout 1000000
    generate seed: 1, objectMode: true, length: 10, (err, records) ->
      return next err if err
      for record in records
        for field in record
          field.length.should.be.below 17
      next()

  it 'is set to 4', (next) ->
    @timeout 1000000
    generate max_word_length: 4, seed: 1, objectMode: true, length: 10, (err, records) ->
      return next err if err
      for record in records
        for field in record
          field.length.should.be.below 5
      next()
