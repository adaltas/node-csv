
###
Test CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)
###

require 'coffee-script'
fs = require 'fs'
should = require 'should'
csv = if process.env.CSV_COV then require '../lib-cov/csv' else require '../src/csv'
generator = if process.env.CSV_COV then require '../lib-cov/generator' else require '../src/generator'

describe 'pipe', ->
  
  it 'should pipe to a file writable stream', (next) ->
    path = "/tmp/large.out"
    w = generator(start: true, duration: 1000).pipe csv().to.path path
    w.on 'close', ->
      fs.unlink path, next