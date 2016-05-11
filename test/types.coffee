
should = require 'should'
stringify = if process.env.CSV_COV then require '../lib-cov' else require '../src'
toXFormatter = () -> 'X'
customFormatterOptions = {
  formatters: {
    date: toXFormatter,
    bool: toXFormatter,
    object: toXFormatter
  }
}

test_date = new Date

describe 'types', ->

  describe 'defaults', ->

    it 'should map date to getTime', (next) ->
      stringify [
        {value: test_date}
      ], (err, data) ->
        data.should.eql test_date.getTime() + '\n'  unless err
        next err

    it 'should map true boolean value to 1', (next) ->
      stringify [
        {value: true}
      ], (err, data) ->
        data.should.eql '1\n'  unless err
        next err

    it 'should map object to its json representation', (next) ->
      stringify [
        {value: {a:1}}
      ], (err, data) ->
        data.should.eql '"{""a"":1}"\n'  unless err
        next err

  describe 'custom formatters', ->

    it 'should let overwrite date formatter', (next) ->
      stringify [
        {value: test_date}
      ], customFormatterOptions, (err, data) ->
        data.should.eql 'X\n'  unless err
        next err

    it 'should let overwrite boolean formatter', (next) ->
      stringify [
        {value: true}
      ], customFormatterOptions, (err, data) ->
        data.should.eql 'X\n'  unless err
        next err

    it 'should let overwrite object formatter', (next) ->
      stringify [
        {value: {a:1}}
      ], customFormatterOptions, (err, data) ->
        data.should.eql 'X\n'  unless err
        next err
