
# CSV

    generate = require 'csv-generate'
    parse = require 'csv-parse'
    transform = require 'stream-transform'
    stringify = require 'csv-stringify'

## `csv.generate`

Initialize a new CSV generator, similar to `require('csv-generate')`.

    module.exports.generate = generate

## `csv.parse`

Initialize a new CSV parser, similar to `require('csv-parse')`.

    module.exports.parse = parse

## `csv.transform`

Initialize a new stream transformer, similar to `require('stream-transform')`.

    module.exports.transform = transform

## `csv.stringify()`

Initialize a new CSV stringifier, similar to `require('csv-stringify')`.

    module.exports.stringify = stringify


