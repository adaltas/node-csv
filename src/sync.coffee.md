
# CSV Parse Sync

Provides a synchronous alternative to the CSV parser.

Usage: `records = parse(data, [options]`

    {StringDecoder} = require 'string_decoder'
    parse = require './index'

    module.exports = (data, options={})->
      records = if options.objname then {} else []
      if data instanceof Buffer
        decoder = new StringDecoder()
        data = decoder.write data
      parser = new parse.Parser options
      parser.push = (record) ->
        if options.objname
          records[record[0]] = record[1]
        else
          records.push record
      parser.__write data, false
      parser.__write data.end(), true if data.end
      parser._flush (->)
      # parser.__write data.end(), true if data?.end()
      records
      
      
      
