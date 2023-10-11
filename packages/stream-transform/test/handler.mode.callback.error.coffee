
import { Writable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { generate } from 'csv-generate'
import { stringify } from 'csv-stringify'
import { transform } from '../lib/index.js'

describe 'handler.mode.callback.error', ->

  it 'with parallel 1', ->
    count = 0
    r = new Writable
      write: (_, __, callback) ->
        callback()
    try
      await pipeline(
        generate length: 1000
      ,
        transform parallel: 1, (chunk, callback) ->
          setImmediate ->
            if ++count < 4
              callback null, chunk
            else
              callback new Error 'Catchme'
      ,
        r
      )
      throw Error 'Oh no!'
    catch err
      count.should.eql 4
      err.message.should.eql 'Catchme'

  it 'handler with callback with parallel 10', ->
    count = 0
    r = new Writable
      objectMode: true,
      write: (_, __, callback) ->
        callback()
    try
      await pipeline(
        generate length: 1000, objectMode: true
      ,
        transform parallel: 10, (record, callback) ->
          setTimeout ->
            if ++count < 4
              callback null, record
            else
              callback new Error 'Catchme'
          , 10
      ,
        r
      )
      throw Error 'Oh no!'
    catch err
      count.should.eql 4
      err.message.should.eql 'Catchme'
