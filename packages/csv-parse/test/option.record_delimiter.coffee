
parse = require '../lib'

describe 'Option `record_delimiter`', ->
  
  describe 'validation', ->

    it 'is compatible with buffer size', (next) ->
      parser = parse record_delimiter: ['::::::'], (err, data) ->
        data.should.eql [
          [ '1', '2', '3' ]
          [ 'b', 'c', 'd' ]
        ]
        next err
      parser.write c for c in """
      1,2,3::::::b,c,d
      """
      parser.end()

  it 'as a string', (next) ->
    parse """
    ABC,45::DEF,23
    """, record_delimiter: '::', (err, data) ->
      return next err if err
      data.should.eql [
        [ 'ABC','45' ]
        [ 'DEF','23' ]
      ]
      next()

  it 'as an array', (next) ->
    parse """
    ABC,45::DEF,23\n50,60
    """, record_delimiter: ['::','\n'], (err, data) ->
      return next err if err
      data.should.eql [
        [ 'ABC','45' ]
        [ 'DEF','23' ]
        [ '50', '60']
      ]
      next()
  
  it 'ensure that delimiter and record_delimiter doesnt match', (next) ->
    parse """
    a;b
    11;22;
    33;33;
    
    """,
      delimiter: ';'
      record_delimiter: [';\n', '\n']
    , (err, data) ->
      data.should.eql [
        [ 'a', 'b' ]
        [ '11', '22' ]
        [ '33', '33' ]
      ] unless err
      next err

  it 'handle new line preceded by a quote when record_delimiter is a string', (next) ->
    parse """
    "ABC","45"::"DEF","23"::"GHI","94"
    """, record_delimiter: '::', (err, data) ->
      return next err if err
      data.should.eql [
        [ 'ABC','45' ]
        [ 'DEF','23' ]
        [ 'GHI','94' ]
      ]
      next()

  it 'handle new line preceded by a quote when record_delimiter is an array', (next) ->
    parse """
    "ABC","45"::"DEF","23"::"GHI","94"\r\n"JKL","13"
    """, record_delimiter: ['::', '\r\n'], (err, data) ->
      return next err if err
      data.should.eql [
        [ 'ABC','45' ]
        [ 'DEF','23' ]
        [ 'GHI','94' ]
        [ 'JKL','13' ]
      ]
      next()

  it 'handle chunks of multiple chars when record_delimiter is a string', (next) ->
    data = []
    parser = parse record_delimiter: '::'
    parser.on 'readable', ->
      while d = parser.read()
        data.push d
    parser.on 'end', ->
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

  it 'handle chunks of multiple chars when record_delimiter is an array', (next) ->
    data = []
    parser = parse record_delimiter: ['::', '\r']
    parser.on 'readable', ->
      while d = parser.read()
        data.push d
    parser.on 'end', ->
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

  it 'handle chunks of multiple chars without quotes when record_delimiter is a string', (next) ->
    data = []
    parser = parse record_delimiter: '::'
    parser.on 'readable', ->
      while d = parser.read()
        data.push d
    parser.on 'end', ->
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

  it 'handle chunks of multiple chars without quotes when record_delimiter is an array', (next) ->
    data = []
    parser = parse record_delimiter: ['::','\n','\r\n']
    parser.on 'readable', ->
      while d = parser.read()
        data.push d
    parser.on 'end', ->
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
  
  describe 'auto', ->
    
    it 'No record', (next) ->
      # not sure if the current behavior is right,
      # the new behavior is proposing [['']]
      # which kind of look more appropriate
      parse "", (err, data) ->
        data.should.eql [] unless err
        next err

    it 'handle chunks in autodiscovery', (next) ->
      data = []
      parser = parse()
      parser.on 'readable', ->
        while d = parser.read()
          data.push d
      parser.on 'end', ->
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
      parser.on 'end', ->
        data.should.eql [
          [ 'abc', '123' ]
          [ 'def', '456' ]
        ]
        next()
      parser.write 'abc,123'
      parser.write '\n'
      parser.write 'def,456'
      parser.end()

    it 'Test line ends with field delimiter and without record delimiter', (next) ->
      parse '"a","b","c",', delimiter: ',', (err, data) ->
        return next err if err
        data.should.eql [
          [ 'a','b','c','' ]
        ]
        next()

    it 'ensure autodiscovery support chunck between lines', (next) ->
      data = []
      parser = parse()
      parser.on 'readable', ->
        while d = parser.read()
          data.push d
      parser.on 'end', ->
        data.should.eql [
          [ 'ABC','45' ]
          [ 'DEF','23' ]
          [ 'GHI','94' ]
          [ 'JKL','02' ]
        ]
        next()
      parser.write 'ABC,45'
      parser.write '\r\nDEF,23\r'
      parser.write '\nGHI,94\r\n'
      parser.write 'JKL,02\r\n'
      parser.end()

    it 'skip default record delimiters when quoted', (next) ->
      parser = parse (err, data) -> # record_delimiter: '\r\n', 
        data.should.eql [
          ['1', '2', '\n']
          ['3', '4', '']
        ] unless err
        next err
      parser.write c for c in '1,2,"\n"\r\n3,4,'
      parser.end()
      
    it 'with skip empty lines', (next) ->
      parse """
      ABC\r\n\r\nDEF\r\n\r\n
      """, skip_empty_lines: true, (err, data) ->
        data.should.eql [
          [ 'ABC' ]
          [ 'DEF' ]
        ] unless err
        next err
