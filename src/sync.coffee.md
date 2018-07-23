

# CSV Generator Sync

Provides a synchronous alternative to the CSV generator.

## Usage 

`generate(options)`  

    generate = require '.'

    module.exports = (options) ->
      if typeof options is 'string' and /\d+/.test options
        options = parseInt options
      if Number.isInteger options
        options = length: options
      unless Number.isInteger options?.length
        throw Error 'Invalid Argument: length is not defined'
      chunks = []
      work = true
      # See https://nodejs.org/api/stream.html#stream_new_stream_readable_options
      options.highWaterMark = if options.objectMode then 16 else 16384
      generator = new generate.Generator options
      generator.push = (chunk) ->
        return work = false if chunk is null
        if options.objectMode
          chunks.push chunk
        else
          chunks.push chunk
      while work
        generator._read options.highWaterMark
      chunks = chunks.join '' unless options.objectMode
      chunks
        
      
