
should = require 'should'
fs = require 'fs'
parse = require '../src'

describe 'rowDelimiter', ->

  it 'No rows', (next) ->
    parse "", (err, data) ->
      data.should.eql [] unless err
      next err

  it 'Test line breaks custom when rowDelimiter is a string', (next) ->
    parse """
    ABC,45::DEF,23
    """, rowDelimiter: '::', (err, data) ->
      return next err if err
      data.should.eql [
        [ 'ABC','45' ]
        [ 'DEF','23' ]
      ]
      next()

  it 'Test line breaks custom when rowDelimiter is an array', (next) ->
    parse """
    ABC,45::DEF,23\n50,60
    """, rowDelimiter: ['::','\n'], (err, data) ->
      return next err if err
      data.should.eql [
        [ 'ABC','45' ]
        [ 'DEF','23' ]
        [ '50', '60']
      ]
      next()

  it 'handle new line preceded by a quote when rowDelimiter is a string', (next) ->
    parse """
    "ABC","45"::"DEF","23"::"GHI","94"
    """, rowDelimiter: '::', (err, data) ->
      return next err if err
      data.should.eql [
        [ 'ABC','45' ]
        [ 'DEF','23' ]
        [ 'GHI','94' ]
      ]
      next()

  it 'handle new line preceded by a quote when rowDelimiter is an array', (next) ->
    parse """
    "ABC","45"::"DEF","23"::"GHI","94"\r\n"JKL","13"
    """, rowDelimiter: ['::', '\r\n'], (err, data) ->
      return next err if err
      data.should.eql [
        [ 'ABC','45' ]
        [ 'DEF','23' ]
        [ 'GHI','94' ]
        [ 'JKL','13' ]
      ]
      next()

  it 'handle chunks of multiple chars when rowDelimiter is a string', (next) ->
    data = []
    parser = parse rowDelimiter: '::'
    parser.on 'readable', ->
      while d = parser.read()
        data.push d
    parser.on 'finish', ->
      data.should.eql [
        [ 'ABC','45' ]
        [ 'DEF','23' ]
        [ 'GHI','94' ]
        [ 'JKL','02' ]
      ]
      next()
    parser.write '"ABC","45"'
    parser.write '::"DEF","23":'
    parser.write ':"GHI","94"::'
    parser.write '"JKL","02"'
    parser.end()

  it 'handle chunks of multiple chars when rowDelimiter is an array', (next) ->
    data = []
    parser = parse rowDelimiter: ['::', '\r']
    parser.on 'readable', ->
      while d = parser.read()
        data.push d
    parser.on 'finish', ->
      data.should.eql [
        [ 'ABC','45' ]
        [ 'DEF','23' ]
        [ 'GHI','94' ]
        [ 'JKL','02' ]
        [ 'MNO','13' ]
      ]
      next()
    parser.write '"ABC","45"'
    parser.write '::"DEF","23":'
    parser.write ':"GHI","94"::'
    parser.write '"JKL","02"\r'
    parser.write '"MNO","13"'
    parser.end()

  it 'handle chunks of multiple chars without quotes when rowDelimiter is a string', (next) ->
    data = []
    parser = parse rowDelimiter: '::'
    parser.on 'readable', ->
      while d = parser.read()
        data.push d
    parser.on 'finish', ->
      data.should.eql [
        [ 'ABC','45' ]
        [ 'DEF','23' ]
        [ 'GHI','94' ]
        [ 'JKL','02' ]
      ]
      next()
    parser.write 'ABC,45'
    parser.write '::DEF,23:'
    parser.write ':GHI,94::'
    parser.write 'JKL,02'
    parser.end()

  it 'handle chunks of multiple chars without quotes when rowDelimiter is an array', (next) ->
    data = []
    parser = parse rowDelimiter: ['::','\n','\r\n']
    parser.on 'readable', ->
      while d = parser.read()
        data.push d
    parser.on 'finish', ->
      data.should.eql [
        [ 'ABC','45' ]
        [ 'DEF','23' ]
        [ 'GHI','94' ]
        [ 'JKL','02' ]
      ]
      next()
    parser.write 'ABC,45\n'
    parser.write 'DEF,23:'
    parser.write ':GHI,94\r'
    parser.write '\nJKL,02'
    parser.end()

  it 'handle chunks in autodiscovery', (next) ->
    data = []
    parser = parse()
    parser.on 'readable', ->
      while d = parser.read()
        data.push d
    parser.on 'finish', ->
      data.should.eql [
        [ 'ABC','45' ]
        [ 'DEF','23' ]
        [ 'GHI','94' ]
        [ 'JKL','02' ]
      ]
      next()
    parser.write '"ABC","45"'
    parser.write '\n"DEF","23"\n'
    parser.write '"GHI","94"\n'
    parser.write '"JKL","02"'
    parser.end()
  
  it 'write aggressively', (next) ->
    data = []
    parser = parse()
    parser.on 'readable', ->
      while(d = parser.read())
        data.push d
    parser.on 'finish', ->
      data.should.eql [
        [ 'abc', '123' ]
        [ 'def', '456' ]
      ]
      next()
    parser.write 'abc,123'
    parser.write '\n'
    parser.write 'def,456'
    parser.end()

  it 'Test line ends with field delimiter and without row delimiter', (next) ->
    parse '"a","b","c",', delimiter: ',', (err, data) ->
      return next err if err
      data.should.eql [
        [ 'a','b','c','' ]
      ]
      next()
      
  it 'If the rowDelimiter(string) does not match from the csv data, parsing should terminate with appropriate error message when the data read is more than the value set for max_limit_on_data_read', (next) ->
    parse """
    a,b,c
    a,b,c
    a,b,c
    a,b,c
    a,b,c
    """, delimiter: ',', rowDelimiter: '\t', max_limit_on_data_read: 10, (err, data) ->
      err.message.should.eql 'Row delimiter not found in the file ["\\t"]'
      should(data).not.be.ok()
      next()

  it 'If the rowDelimiter(array) does not match from the csv data, parsing should terminate with appropriate error message when the data read is more than the value set for max_limit_on_data_read', (next) ->
    parse """
    a,b,c
    a,b,c
    a,b,c
    a,b,c
    a,b,c
    """, delimiter: ',', rowDelimiter: ['\t'], max_limit_on_data_read: 10, (err, data) ->
      err.message.should.eql 'Row delimiter not found in the file ["\\t"]'
      should(data).not.be.ok()
      next()
