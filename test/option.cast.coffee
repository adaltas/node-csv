
stringify = require '../src'

describe 'Option `cast`', ->

  it 'handle string formatter', (next) ->
    stringify [
      value: 'ok'
    ], {cast: string: -> 'X'}, (err, data) ->
      data.should.eql 'X\n'  unless err
      next err

  it 'handle boolean formatter', (next) ->
    stringify [
      value: true
    ], {cast: boolean: -> 'X'}, (err, data) ->
      data.should.eql 'X\n'  unless err
      next err

  it 'handle date formatter', (next) ->
    stringify [
      value: new Date
    ], {cast: date: -> 'X'}, (err, data) ->
      data.should.eql 'X\n'  unless err
      next err

  it 'handle number formatter', (next) ->
    stringify [
      value: 3.14
    ], {cast: number: (value) -> '' + value * 2 }, (err, data) ->
      data.should.eql '6.28\n'  unless err
      next err

  it 'handle object formatter', (next) ->
    stringify [
      value: a: 1
    ], {cast: object: -> 'X'}, (err, data) ->
      data.should.eql 'X\n'  unless err
      next err

  it 'catch error', (next) ->
    stringify [
      value: true
    ], {cast: boolean: (value) -> throw Error 'Catchme'}, (err, data) ->
      err.message.should.eql 'Catchme'
      next()

  it 'return null', (next) ->
    # We might change this behavior in futures version, allowing to skip a field
    # if the return value is null or undefined, see #83
    stringify [
      { a: true, b: true }
      { a: false, b: true }
      { a: true, b: false }
      { a: false, b: false }
    ], {cast: boolean: (value) -> if value then '1' else null}, (err, data) ->
      data.trim().should.eql """
      1,1
      ,1
      1,
      ,
      """
      next()

  it 'boolean must return a string', (next) ->
    stringify [
      value: true
    ], {cast: boolean: (value) -> if value then 1 else 0}, (err, data) ->
      err.message.should.eql 'Invalid Casting Value: returned value must return a string, an object, null or undefined, got 1'
      next()
  
  describe 'context', ->
  
    it 'expose the expected properties', (next) ->
      stringify [
        ['a']
      ], cast: string: (value, context) ->
        Object.keys(context).sort().should.eql [
          'column', 'header', 'index', 'records'
        ]
        null
      , next
  
    it 'index and column on array', (next) ->
      stringify [
        [true, false]
      ], cast: boolean: (value, context) ->
        if value
          context.index.should.equal 0
          context.column.should.equal 0
          'yes'
        else
          context.index.should.equal 1
          context.column.should.equal 1
          'no'
      , (err, data) ->
        data.trim().should.eql 'yes,no'
        next()
        
    it 'index and column on object', (next) ->
      stringify [
        is_true: true
        is_false: false
      ], cast: boolean: (value, context) ->
        if value
          context.index.should.equal 0
          context.column.should.equal 'is_true'
          'yes'
        else
          context.index.should.equal 1
          context.column.should.equal 'is_false'
          'no'
      , (err, data) ->
        data.trim().should.eql 'yes,no'
        next()
    
    it 'header', (next) ->
      stringify [
        ['value 1']
        ['value 2']
      ], header: true, columns: ['header'], cast: string: (value, context) ->
        "#{value} | #{context.header}"
      , (err, data) ->
        data.trim().should.eql """
        header | true
        value 1 | false
        value 2 | false
        """
        next err
    
  describe 'option header', ->

    it 'records with header and columns as array', (next) ->
      stringify [
        ['value 1']
        ['value 2']
      ], header: true, columns: ['header'], cast: string: (value, context) ->
        "#{context.records}"
      , (err, data) ->
        data.trim().should.eql '0\n0\n1' unless err
        next err

    it 'records without header', (next) ->
      stringify [
        ['record 1']
        ['record 2']
      ], cast: string: (value, context) ->
        "#{context.records}"
      , (err, data) ->
        data.trim().should.eql '0\n1' unless err
        next err
    
  describe 'info object', ->
  
    it 'modify escape', (next) ->
      stringify [
        ['record " 1']
        ['record " 2']
        ['record " 3']
      ], eof: false, escape: '#', cast: string: (value, context) ->
        return value if context.records is 2
        value: value, escape: ['\\', '"'][context.records]
      , (err, data) ->
        data.should.eql """
        "record \\" 1"
        "record "" 2"
        "record #" 3"
        """
        next err
    
    
