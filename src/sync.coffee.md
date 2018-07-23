
# CSV Parse Sync

Provides a synchronous alternative to the CSV parser.

Usage: `const records = parse(data, [options]`

    {StringDecoder} = require 'string_decoder'
    parse = require './index'

    module.exports = (data, options={})->
      chunks = if options.objname then {} else []
      if data instanceof Buffer
        decoder = new StringDecoder()
        data = decoder.write data
      parser = new parse.Parser options
      parser.push = (chunk) ->
        if options.objname
          chunks[chunk[0]] = chunk[1]
        else
          chunks.push chunk
      err = parser.__write data, false
      throw err if err
      if data instanceof Buffer
        err = parser.__write data.end(), true
        throw err if err
      err = parser.__flush()
      throw err if err
      chunks
