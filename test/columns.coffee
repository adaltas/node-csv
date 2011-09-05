
# Test CSV - Copyright David Worms <open@adaltas.com> (MIT Licensed)

fs = require('fs')
assert = require('assert')
csv = require('csv')

module.exports =
    'Test columns in true': ->
        # Note: if true, columns are expected to be in first line
        csv()
        .fromPath("#{__dirname}/columns/in_true.in",
            columns: true
        )
        .toPath("#{__dirname}/columns/in_true.tmp")
        .transform( (data, index) ->
            assert.equal true, data instanceof Object
            assert.equal false, data instanceof Array
            if index is 0
                assert.strictEqual '20322051544', data.FIELD_1
            else if index is 1
                assert.strictEqual 'DEF', data.FIELD_4
            data
        )
        .on('end', (count) ->
            assert.strictEqual 2, count
            assert.equal(
                fs.readFileSync("#{__dirname}/columns/in_true.out").toString(),
                fs.readFileSync("#{__dirname}/columns/in_true.tmp").toString()
            )
            fs.unlink("#{__dirname}/columns/in_true.tmp")
        )
    'Test columns in named': ->
        # Note: if true, columns are expected to be in first line
        csv()
        .fromPath("#{__dirname}/columns/in_named.in",{
            columns: ["FIELD_1", "FIELD_2", "FIELD_3", "FIELD_4", "FIELD_5", "FIELD_6"]
        })
        .toPath("#{__dirname}/columns/in_named.tmp")
        .transform((data, index) ->
            assert.equal(true, data instanceof Object)
            assert.equal(false, data instanceof Array)
            if index is 0
                assert.strictEqual '20322051544', data.FIELD_1
            else if index is 1
                assert.strictEqual 'DEF', data.FIELD_4
            data
        )
        .on('data',(data, index) ->
            assert.equal(true, data instanceof Object)
            assert.equal(false, data instanceof Array)
        )
        .on('end',(count) ->
            assert.strictEqual 2, count
            assert.equal(
                fs.readFileSync("#{__dirname}/columns/in_named.out").toString(),
                fs.readFileSync("#{__dirname}/columns/in_named.tmp").toString()
            )
            fs.unlink("#{__dirname}/columns/in_named.tmp")
        )
    'Test columns out named': ->
        # Note: if true, columns are expected to be in first line
        csv()
        .fromPath("#{__dirname}/columns/out_named.in")
        .toPath("#{__dirname}/columns/out_named.tmp",
            columns: ["FIELD_1", "FIELD_2"]
        )
        .transform( (data, index) ->
            assert.equal(true, data instanceof Array)
            return {FIELD_2: data[3], FIELD_1: data[4]}
        )
        .on('data', (data, index) ->
            assert.equal true, data instanceof Object
            assert.equal false, data instanceof Array
        )
        .on('end', (count) ->
            assert.strictEqual 2, count
            assert.equal(
                fs.readFileSync("#{__dirname}/columns/out_named.out").toString(),
                fs.readFileSync("#{__dirname}/columns/out_named.tmp").toString()
            )
            fs.unlink "#{__dirname}/columns/out_named.tmp"
        )
