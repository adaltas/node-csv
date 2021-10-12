
import { stringify } from '../lib/index.js'

describe 'Option `quoted_empty`', ->

  it 'quotes empty fields (when all not quoted)', (next) ->
    count = 0
    data = ''
    stringifier = stringify quoted: false, quoted_empty: true, eof: false
    stringifier.on 'readable', ->
      while(d = stringifier.read())
        data += d
    stringifier.on 'record', (record, index) ->
      count++
    stringifier.on 'finish', ->
      count.should.eql 1
      data.should.eql """
      "","","", ,0,""
      """
      next()
    stringifier.write [ undefined,null,'',' ',0,false ]
    stringifier.end()

  it 'quotes empty fields (when strings quoted)', (next) ->
    count = 0
    data = ''
    stringifier = stringify quoted_empty: true, quoted_string: true, eof: false
    stringifier.on 'readable', ->
      while(d = stringifier.read())
        data += d
    stringifier.on 'record', (record, index) ->
      count++
    stringifier.on 'finish', ->
      count.should.eql 1
      data.should.eql """
      "","",""," ",0,""
      """
      next()
    stringifier.write [ undefined,null,'',' ',0,false ]
    stringifier.end()

  it 'prevents quoting empty fields (when strings quoted)', (next) ->
    count = 0
    data = ''
    stringifier = stringify quoted_empty: false, quoted_string: true, eof: false
    stringifier.on 'readable', ->
      while(d = stringifier.read())
        data += d
    stringifier.on 'record', (record, index) ->
      count++
    stringifier.on 'finish', ->
      count.should.eql 1
      data.should.eql """
      ,,," ",0,
      """
      next()
    stringifier.write [ undefined,null,'',' ',0,false ]
    stringifier.end()

  it 'quotes empty fields (when all quoted)', (next) ->
    count = 0
    data = ''
    stringifier = stringify quoted: true, quoted_empty: true, eof: false
    stringifier.on 'readable', ->
      while(d = stringifier.read())
        data += d
    stringifier.on 'record', (record, index) ->
      count++
    stringifier.on 'finish', ->
      count.should.eql 1
      data.should.eql """
      "","",""," ","0",""
      """
      next()
    stringifier.write [ undefined,null,'',' ',0,false ]
    stringifier.end()
