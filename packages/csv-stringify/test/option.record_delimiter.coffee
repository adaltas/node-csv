
import stringify from '../lib/index.js'

describe 'Option `record_delimiter`', ->
  
  it 'validation', ->
    stringify [], record_delimiter: ''
    stringify [], record_delimiter: ','
    stringify [], record_delimiter: ',,'
    stringify [], record_delimiter: Buffer.from ','
    ( ->
      stringify [], record_delimiter: true
    ).should.throw 'Invalid Option: record_delimiter must be a buffer or a string, got true'
    ( ->
      stringify [], record_delimiter: false
    ).should.throw 'Invalid Option: record_delimiter must be a buffer or a string, got false'
    ( ->
      stringify [], record_delimiter: 123
    ).should.throw 'Invalid Option: record_delimiter must be a buffer or a string, got 123'
  
  it 'Test line breaks custom string', (next) ->
    stringify [
      [ '20322051544','8.8017226E7','ABC' ]
      [ '28392898392','8.8392926E7','DEF' ]
    ], record_delimiter: '::', (err, result) ->
      return next err if err
      result.should.eql '20322051544,8.8017226E7,ABC::28392898392,8.8392926E7,DEF::'
      next()

  it 'Test line breaks custom buffer', (next) ->
    stringify [
      [ '20322051544','8.8017226E7','ABC' ]
      [ '28392898392','8.8392926E7','DEF' ]
    ], record_delimiter: Buffer.from('::'), (err, result) ->
      return next err if err
      result.should.eql '20322051544,8.8017226E7,ABC::28392898392,8.8392926E7,DEF::'
      next()

  it 'Test line breaks unix', (next) ->
    stringify [
      [ '20322051544','8.8017226E7','ABC' ]
      [ '28392898392','8.8392926E7','DEF' ]
    ], record_delimiter: 'unix', (err, result) ->
      return next err if err
      result.should.eql '20322051544,8.8017226E7,ABC\n28392898392,8.8392926E7,DEF\n'
      next()

  it 'Test line breaks unicode', (next) ->
    stringify [
      [ '20322051544','8.8017226E7','ABC' ]
      [ '28392898392','8.8392926E7','DEF' ]
    ], record_delimiter: 'unicode', (err, result) ->
      return next err if err
      result.should.eql '20322051544,8.8017226E7,ABC\u202828392898392,8.8392926E7,DEF\u2028'
      next()

  it 'Test line breaks mac', (next) ->
    stringify [
      [ '20322051544','8.8017226E7','ABC' ]
      [ '28392898392','8.8392926E7','DEF' ]
    ], record_delimiter: 'mac', (err, result) ->
      return next err if err
      result.should.eql '20322051544,8.8017226E7,ABC\r28392898392,8.8392926E7,DEF\r'
      next()

  it 'Test line breaks windows', (next) ->
    stringify [
      [ '20322051544','8.8017226E7','ABC' ]
      [ '28392898392','8.8392926E7','DEF' ]
    ], record_delimiter: 'windows', (err, result) ->
      return next err if err
      result.should.eql '20322051544,8.8017226E7,ABC\r\n28392898392,8.8392926E7,DEF\r\n'
      next()

  it 'Test line breaks ascii', (next) ->
    stringify [
      [ '20322051544','8.8017226E7','ABC' ]
      [ '28392898392','8.8392926E7','DEF' ]
    ], record_delimiter: 'ascii', delimiter: '\u001f', (err, result) ->
      return next err if err
      result.should.eql '20322051544\u001f8.8017226E7\u001fABC\u001e28392898392\u001f8.8392926E7\u001fDEF\u001e'
      next()
