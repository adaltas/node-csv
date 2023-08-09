
import {generate as generateStream} from 'csv-generate/stream'
import {parse as parseStream} from '../lib/stream.js'
import {parse as parseClassic} from '../lib/index.js'

describe 'api stream', ->

  it.skip 'perf classic', ->
    console.time('classic')
    generator = generateClassic({
      objectMode: true,
      length: 10000000
    })
    for await record from generator
      continue
    console.timeEnd('classic')

  it.skip 'perf stream', ->
    console.time('stream')
    generator = generateStream({
      objectMode: true,
      length: 10000000
    })
    reader = generator.getReader()
    while true
      { done, value } = await reader.read()
      break if done
    # for await chunk from generator.getReader().read()
    #   console.log(Buffer.from(chunk).toString());
    console.timeEnd('stream')

  it 'perf stream with iterator', ->
    generator = generateStream
      objectMode: false,
      length: 5
    parser = parseStream()
    stream = generator.pipeThrough parser
    records = []
    for await record from stream
      records.push record
    records.length.should.eql 5

  # it 'perf stream with reader', ->
  #   generator = generateStream({
  #     objectMode: true,
  #     length: 10
  #   });
  #   records = []
  #   reader = generator.getReader()
  #   while true
  #     { done, record } = await reader.read()
  #     break if done
  #     records.push record
  #   records.length.should.eql 10
