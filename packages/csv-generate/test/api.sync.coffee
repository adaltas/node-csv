
generate = require '../src/sync'

describe 'api sync', ->

  it 'throw error if length is not provided', ->
    (-> generate()).should.throw 'Invalid Argument: length is not defined'
    (-> generate 3.14).should.throw 'Invalid Argument: length is not defined'

  it 'accept length as an integer', ->
    data = generate 1000
    data.split(/\n/).length.should.eql 1000

  it 'accept length as a string integer', ->
    data = generate '1000'
    data.split(/\n/).length.should.eql 1000

  it 'honors objectMode', ->
    data = generate length: 1000, objectMode: true
    data.length.should.eql 1000
