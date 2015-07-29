
should = require 'should'
parse = require '../src'

describe 'rowDelimiter', ->

  it 'No rows', (next) ->
    parse "", (err, data) ->
      data.should.eql [] unless err
      next err

  it 'Test line breaks custom', (next) ->
    parse """
    ABC,45::DEF,23
    """, rowDelimiter: '::', (err, data) ->
      return next err if err
      data.should.eql [
        [ 'ABC','45' ]
        [ 'DEF','23' ]
      ]
      next()

  it 'handle new line precede with a quote', (next) ->
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

  it 'handle chuncks of multiple chars', (next) ->
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
  
  it 'handle chuncks in autodiscovery', (next) ->
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
