
import fs from 'fs'
import os from 'os'
import { generate } from 'csv-generate'
import { parse } from '../lib/index.js'

describe 'API destroy', ->
  
  it 'inside readable with input string', (next) ->
    parser = parse()
    parser.on 'readable', ->
      while this.read()
        parser.destroy(Error 'Catch me')
    parser.write """
    "ABC","45"
    "DEF","23"
    """
    parser.on 'error', (err) ->
      err.message.should.eql 'Catch me'
      parser._readableState.destroyed.should.be.true()
      next()
    parser.on 'end', ->
      next Error 'End event shouldnt be called'
    # Note, removing =nextTick trigger both the error and end events
    process.nextTick ->
      parser.end()
        
  it 'inside readable with fs input stream', (next) ->
    fs.writeFile "#{os.tmpdir()}/data.csv", "a,b,c\n1,2,3", (err) ->
      return next err if err
      parser = parse()
      parser.on 'readable', ->
        while record = this.read()
          parser.destroy(Error 'Catch me')
      parser.on 'error', (err) ->
        err.message.should.eql 'Catch me'
        parser._readableState.destroyed.should.be.true()
        next()
      parser.on 'end', ->
        next Error 'End event shouldnt be called'
      fs
      .createReadStream "#{os.tmpdir()}/data.csv"
      .pipe parser
      
  it 'inside readable with generator input stream', (next) ->
    # csv-generate emit data synchronously, it cant detect error on time
    parser = parse()
    parser.on 'readable', ->
      while record = this.read()
        parser.destroy(Error 'Catch me')
    parser.on 'error', (err) ->
      err.message.should.eql 'Catch me'
      parser._readableState.destroyed.should.be.true()
      version = parseInt /^v(\d+)/.exec(process.version)[1], 10
      next() if version >= 14
    parser.on 'end', ->
      next()
    generate length: 2, seed: 1, columns: 2, fixed_size: true
    .pipe parser
