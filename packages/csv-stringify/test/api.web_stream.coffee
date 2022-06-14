
# import {generate as generateStream} from 'csv-generate/stream'
# import {stringify as stringifyStream} from '../lib/stream.js'
# import {stringify as stringifyClassic} from '../lib/index.js'
#
# describe 'api stream', ->
#
#   it.skip 'perf stream with iterator', ->
#     generator = generateStream
#       objectMode: true,
#       length: 5
#     stringifier = stringifyStream()
#     stream = generator.pipeThrough stringifier
#     chunks = []
#     for await chunk from stream
#       chunks.push chunk
#     # records.length.should.eql 5
#     console.log(chunks)
