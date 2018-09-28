
# CSV Stringify Sync

Provides a synchronous alternative to the CSV stringifier.

## Usage

`const csv = stringify(records, [options]`

    {StringDecoder} = require 'string_decoder'
    stringify = require './index'

    module.exports = (records, options={})->
      data = []
      if records instanceof Buffer
        decoder = new StringDecoder()
        records = decoder.write records
      stringifier = new stringify.Stringifier options
      stringifier.push = (record) ->
        data.push record.toString() if record
      stringifier.write record for record in records
      stringifier.end()
      data.join ''
      
      
      
