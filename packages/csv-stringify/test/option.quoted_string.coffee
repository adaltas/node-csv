
import { stringify } from '../lib/index.js'

describe 'Option `quoted_string`', ->
  
  it 'quotes string fields', (next) ->
    stringify [
      [ undefined,null,'',' ','x',0,false ]
    ],
      quoted_string: true
      eof: false
    , (err, data) ->
      data.toString().should.eql """
      ,,""," ","x",0,
      """ unless err
      next err

  it 'quotes empty string fields (when all quoted)', (next) ->
    count = 0
    data = ''
    stringifier = stringify quoted: true, quoted_string: true, eof: false
    stringifier.on 'readable', ->
      while(d = stringifier.read())
        data += d
    stringifier.on 'record', (record, index) ->
      count++
    stringifier.on 'finish', ->
      count.should.eql 1
      data.should.eql """
      ,,""," ","x","0",
      """
      next()
    stringifier.write [ undefined,null,'',' ','x',0,false ]
    stringifier.end()
