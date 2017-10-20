
generate = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'options', ->

  it 'no options with default', (next) ->
    @timeout 1000000
    count = 0
    generator = generate()
    generator.on 'readable', ->
      while d = generator.read()
        generator.end() if count++ is 100
    generator.on 'error', next
    generator.on 'end', next
