
import stringify from '../lib/index.js'

describe 'Option `header`', ->

  it 'as "true" and without "column" option with objects', (next) ->
    stringify [
      {field1: 'val11', field2: 'val12', field3: 'val13'}
      {field1: 'val21', field2: 'val22', field3: 'val23'}
    ], header: true, (err, data) ->
      return next err if err
      data.should.eql 'field1,field2,field3\nval11,val12,val13\nval21,val22,val23\n'
      next()

  it 'must get columns from somewhere', (next) ->
    stringify [
      ['h1', 'h2', 'h3']
      ['1', '2', '3']
      ['4', '5', '6']
    ], header: true, (err, data) ->
      err.message.should.eql 'Undiscoverable Columns: header option requires column option or object records'
      next()
  
  it 'is immutable', (next) ->
    options = header: true, quotedEmpty:true, delimiter: "|"
    data1 = [ { a:'1', b:'2', c:'3' }, {a: '4', b: '5', c: '6'} ]
    data2 = [ { x:'1', y:'2', z:'3' }, {x: '4', y: '5', z: '6' } ]
    stringify data1, options, (err, result1) ->
      stringify data2, options, (err, result2) ->
        result1.should.eql "a|b|c\n1|2|3\n4|5|6\n" unless err
        result2.should.eql "x|y|z\n1|2|3\n4|5|6\n" unless err
        next err
  
  describe 'event', ->

    it 'emit header', (next) ->
      count = 0
      data = ''
      stringifier = stringify(columns: [ 'col1', 'col2' ], header: true)
      stringifier.on 'readable', ->
        while(d = stringifier.read())
          data += d
      stringifier.on 'record', (record, index) ->
        count++
      stringifier.on 'finish', ->
        count.should.eql 2
        data.should.eql 'col1,col2\nfoo1,goo1\nfoo2,goo2\n'
        next()
      stringifier.write col1: 'foo1', col2: 'goo1'
      stringifier.write col1: 'foo2', col2: 'goo2'
      stringifier.end()
    
    it 'emit header even without a source', (next) ->
      count = 0
      data = ''
      stringifier = stringify(columns: [ 'col1', 'col2' ], header: true)
      stringifier.on 'readable', ->
        while(d = stringifier.read())
          data += d
      stringifier.on 'end', ->
        data.should.eql 'col1,col2\n'
        next()
      stringifier.end()
    
  describe 'without records', ->

    it 'should print headers if no records to parse', (next) ->
      stringify [], header: true, columns: ['some', 'headers'], (err, data) ->
        data.should.eql 'some,headers\n'
        next()

    it 'should not print headers if no records to parse and no header option', (next) ->
      stringify [], header: false, columns: ['some', 'headers'], (err, data) ->
        data.should.eql ''
        next()
    
  describe 'with column', ->

    it 'filter records array properties not listed as columns', (next) ->
      stringify [
        [ 20322051544, 1979, 'ABC', 45, ]
        [ 28392898392, 1974, 'DEF', 23, ]
      ], header: true, columns: ["a", "b"], eof: false, (err, data) ->
        data.should.eql """
        a,b
        20322051544,1979
        28392898392,1974
        """ unless err
        next err

    it 'filter records object properties not listed as columns', (next) ->
      stringify [
        { a: 20322051544, b: '1979', c: '8.8017226E7' }
        { a: 28392898392, b: '1974', c: '8.8392926E7' }
      ], header: true, columns: ["a", "c"], eof: false, (err, data) ->
        data.should.eql """
        a,c
        20322051544,8.8017226E7
        28392898392,8.8392926E7
        """
        next()

    it 'should map the column property name to display name', (next) ->
      stringify [
        { field1: 'val11', field2: 'val12', field3: 'val13' }
        { field1: 'val21', field2: 'val22', field3: 'val23' }
      ], header: true, columns: {field1: 'column1', field3: 'column3'}, (err, data) ->
        data.should.eql 'column1,column3\nval11,val13\nval21,val23\n' unless err
        next err

    it 'should map the column property name to display name', (next) ->
      stringify [
        { field1: 'val11', field2: 'val12', field3: 'val13' }
        { field1: 'val21', field2: 'val22', field3: 'val23' }
      ], header: true, columns: {field1: 'column1', field3: 'column3'}, (err, data) ->
        data.should.eql 'column1,column3\nval11,val13\nval21,val23\n' unless err
        next err
  
  describe 'nested columns', ->

    it 'and nested properties', (next) ->
      stringify [
        { field1: {nested: 'val11'}, field2: 'val12', field3: 'val13' }
        { field1: {}, field2: 'val22', field3: 'val23' }
      ], header: true, columns: {'field1.nested': 'column1', field3: 'column3'}, (err, data) ->
        data.should.eql 'column1,column3\nval11,val13\n,val23\n' unless err
        next err

    it 'should also work for nested properties', (next) ->
      stringify [
        { field1: {nested: 'val11'}, field2: 'val12', field3: 'val13' }
        { field1: {}, field2: 'val22', field3: 'val23' }
      ], header: true, columns: {'field1.nested': 'column1', field3: 'column3'}, (err, data) ->
        data.should.eql 'column1,column3\nval11,val13\n,val23\n' unless err
        next err
