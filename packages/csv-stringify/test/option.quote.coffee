
import { stringify } from '../lib/index.js'

describe 'Option `quote`', ->
  
  it 'default', (next) ->
    stringifier = stringify [], ->
      stringifier.options.quote.should.eql('"')
      next()
  
  it 'validation', ->
    stringify [], quote: ''
    stringify [], quote: '"'
    stringify [], quote: '||'
    stringify [], quote: Buffer.from '"'
    stringify [], quote: true
    stringify [], quote: false
    ( ->
      stringify [], quote: 123
    ).should.throw 'option `quote` must be a boolean, a buffer or a string, got 123'
  
  it 'disabled if empty', (next) ->
    stringify [
      [ '20322051544','"','8.8017226E7',45,'"ok"' ]
      [ '','1974','8.8392926E7','','' ]
    ], {eof: false, quote: ''}, (err, data) ->
      data.should.eql """
      20322051544,",8.8017226E7,45,"ok"
      ,1974,8.8392926E7,,
      """
      next()

  it 'custom value with quoted', (next) ->
    stringify [
      [ 'a','','b' ]
      [ '','c','' ]
    ], eof: false, quote: '|', quoted: true, (err, data) ->
      data.should.eql """
      |a|,,|b|
      ,|c|,
      """
      next()

  it 'fields with separator inside fields',  (next) ->
    stringify [
      [ '20322051544','1979.0','8.8017226E7','ABC,45','2000-01-01' ]
      [ '28392898392','1974.0','8.8392926E7','DEF','23','2050-11-27' ]
    ], eof: false, (err, data) ->
      data.should.eql """
      20322051544,1979.0,8.8017226E7,"ABC,45",2000-01-01
      28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
      """
      next()

  it 'fields containing delimiters', (next) ->
    stringify [
      [ '20322051544',',1979.0,8.8017226E7,ABC,45,2000-01-01' ]
      [ '28392898392','1974.0','8.8392926E7','DEF','23','2050-11-27' ]
      [ '28392898392,1974.0','8.8392926E7','DEF,23,2050-11-27,' ]
    ], eof: false, (err, data) ->
      data.should.eql """
      20322051544,",1979.0,8.8017226E7,ABC,45,2000-01-01"
      28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
      "28392898392,1974.0",8.8392926E7,"DEF,23,2050-11-27,"
      """
      next()

  it 'fields containing quotes', (next) ->
    stringify [
      [ '20322051544','1979.0','8.801"7226E7','ABC','45','2000-01-01' ]
      [ '28392898392','1974.0','8.8392926E7','DEF','2"3','2050-11-27' ]
    ], eof: false, (err, data) ->
      data.should.eql """
      20322051544,1979.0,"8.801""7226E7",ABC,45,2000-01-01
      28392898392,1974.0,8.8392926E7,DEF,"2""3",2050-11-27
      """
      next()

  it 'empty fields', (next) ->
    stringify [
      [ '20322051544','','8.8017226E7','45','' ]
      [ '','1974','8.8392926E7','','' ]
    ], eof: false, (err, data) ->
      data.should.eql """
      20322051544,,8.8017226E7,45,
      ,1974,8.8392926E7,,
      """
      next()

  it 'fields containing quotes and double quotes escape', (next) ->
    stringify [
      [ '20322051544','"','8.8017226E7',45,'"ok"' ]
      [ '','1974','8.8392926E7','','' ]
    ], eof: false, (err, data) ->
      data.should.eql """
      20322051544,\"\"\"\",8.8017226E7,45,\"\"\"ok\"\"\"
      ,1974,8.8392926E7,,
      """
      next()

  it 'fields with line breaks inside quotes', (next) ->
    stringify [
      [ '20322051544','\n',',8.8017226E7',45,'\nok\n' ]
      [ '\n','1974','8.8392926E7','','\n' ]
    ], eof: false, (err, data) ->
      data.should.eql """
      20322051544,"
      ",",8.8017226E7",45,"
      ok
      "
      "
      ",1974,8.8392926E7,,"
      "
      """
      next()

  it 'field where quote string is empty', (next) ->
    stringify [
      [ '20322051544','"','8.8017226E7',45,'"ok"' ]
      [ '','1974','8.8392926E7','','' ]
    ], {eof: false, quote: ''}, (err, data) ->
      data.should.eql """
      20322051544,",8.8017226E7,45,"ok"
      ,1974,8.8392926E7,,
      """
      next()

  it 'fields with linebreaks and different record delimiter', (next) ->
    stringify [
      [ '123\n456', 789]
      [ '','1974' ]
    ], {eof: false, record_delimiter: '__'}, (err, data) ->
      data.should.eql """
      123
      456,789__,1974
      """
      next()
