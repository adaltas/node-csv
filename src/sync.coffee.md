
# Stream Transformer Sync

Provides a synchronous alternative to the CSV transformer.

## Usage  

`const records = transform(records, [options], handler)`  

## Source Code

    transform = require '.'
    {clone} = require 'mixme'

    module.exports = ->
      # Import arguments normalization
      options = {}
      for argument, i in arguments
        type = typeof argument
        if argument is null then type = 'null'
        else if type is 'object' and Array.isArray argument then type = 'array'
        if type is 'array'
          records = argument
        else if type is 'object'
          options = clone argument
        else if type is 'function'
          if handler and i is arguments.length - 1
          then callback = argument
          else handler = argument
        else if type isnt 'null'
          throw new Error "Invalid Arguments: got #{JSON.stringify argument} at position #{i}"
      # Validate arguments
      expected_handler_length = 1
      expected_handler_length++ if options.params
      throw Error 'Invalid Handler: only synchonous handlers are supported' if handler.length > expected_handler_length
      # Start transformation
      chunks = []
      transformer = new transform.Transformer options, handler
      transformer.push = (chunk) ->
        chunks.push chunk
      for record in records
        transformer._transform record, null, (->)
      chunks
      
