
import { stringify } from '../lib/index.js'

describe 'Option `columns`', ->

  describe 'definition', ->
    
    it 'validates option types', ->
      (->
        stringify [], columns: true, (->)
      ).should.throw 'Invalid option "columns": expect an array or an object'
      (->
        stringify [], columns: false, (->)
      ).should.throw 'Invalid option "columns": expect an array or an object'
      (->
        stringify [], columns: '', (->)
      ).should.throw 'Invalid option "columns": expect an array or an object'
      (->
        stringify [], columns: (->), (->)
      ).should.throw 'Invalid option "columns": expect an array or an object'
        
    it 'validates column definition', ->
      (->
        stringify [], columns: [
          key_does_not_exists: 'yes'
        ], (->)
      ).should.throw 'Invalid column definition: property "key" is required'
      (->
        stringify [], columns: [
          true
        ], (->)
      ).should.throw 'Invalid column definition: expect a string or an object'
        
    it 'is an array with column object', (next) ->
      stringify [
        {a: '11', b: '12'}
        {a: '21', b: '22'}
      ], columns: [
        { key: 'b' }
        { key: 'a' }
      ], (err, records) ->
        records.should.eql "12,11\n22,21\n"
        next err
          
    it 'is an array of strings', (next) ->
      stringify [
        {a: '11', b: '12'}
        {a: '21', b: '22'}
      ], columns: [
        'b'
        'a'
      ], (err, records) ->
        records.should.eql "12,11\n22,21\n"
        next err
          
    it 'is an array of strings matching nested object', (next) ->
      stringify [
        {a: {a1: '1a1', a2: '1a2'}, b: '1b'}
        {a: {a1: '2a1', a2: '2a2'}, b: '2b'}
      ], columns: [
        'b'
        'a.a2'
      ], (err, records) ->
        records.should.eql "1b,1a2\n2b,2a2\n"
        next err
          
    it 'is an array of strings matching nested [object]', (next) ->
      stringify [
        {a: [{}, {a1: '1a1', a2: '1a2'}], b: '1b'}
        {a: [{}, {a1: '2a1', a2: '2a2'}], b: '2b'}
      ], columns: [
        'b'
        'a[1].a2'
      ], (err, records) ->
        records.should.eql "1b,1a2\n2b,2a2\n"
        next err
          
    it 'is an array of strings with parent key not matching a nested object', (next) ->
      stringify [
        {a: undefined, b: '1b'}
        {a: null, b: '2b'}
        {a: false, b: '3b'}
      ], columns: [
        'b'
        'a.a2'
      ], (err, records) ->
        records.should.eql "1b,\n2b,\n3b,\n"
        next err
          
    it 'can still access fields with dots', (next) ->
      stringify [
        {'foo.bar': '1'}
        {'foo.bar': '2'}
      ], header: true, (err, records) ->
        records.should.eql "foo.bar\n1\n2\n" unless err
        next err
  
  describe 'input', ->

    it 'is an array, should be the same length', (next) ->
      # Since there is not columns set in input options, we just expect
      # the output stream to contains 2 fields
      stringify [
        [ '20322051544','1979','8.8017226E7','ABC','45','2000-01-01' ]
        [ '28392898392','1974','8.8392926E7','DEF','23','2050-11-27' ]
      ], columns: ["FIELD_1", "FIELD_2"], (err, data) ->
        data.should.eql '20322051544,1979\n28392898392,1974\n' unless err
        next err

    it 'is a readable stream', (next) ->
      ws = stringify
        header: true
        columns: field1: 'column1', field3: 'column3'
      , (err, data) ->
        data.should.eql 'column1,column3\nval11,val13\nval21,val23\n' unless err
        next err
      ws.write {field1: 'val11', field2: 'val12', field3: 'val13'}
      ws.write {field1: 'val21', field2: 'val22', field3: 'val23'}
      ws.end()
