
# Stream Transformer Sync

Provides a synchronous alternative to the CSV transformer.

## Usage  

`const records = transform(data, [options])`  

## Source Code

    transform = require '.'

    module.exports = ->
      # Import arguments normalization
      options = {}
      for argument, i in arguments
        type = typeof argument
        if argument is null then type = 'null'
        else if type is 'object' and Array.isArray argument then type = 'array'
        if i is 0
          if type is 'function'
            handler = argument
          else if type isnt null
            data = argument
          continue
        if type is 'object'
          for k, v of argument then options[k] = v
        else if type is 'function'
          if handler and i is arguments.length - 1
          then callback = argument
          else handler = argument
        else if type isnt 'null'
          throw new Error 'Invalid arguments'
      # Validate arguments
      expected_handler_length = 1
      expected_handler_length++ if options.params
      throw Error 'Invalid Handler: only synchonous handlers are supported' if handler.length > expected_handler_length
      # Start transformation
      chunks = []
      transformer = new transform.Transformer options, handler
      transformer.push = (chunk) ->
        chunks.push chunk
      for record in data
        transformer._transform record, null, (->)
      chunks
      
