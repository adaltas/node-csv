
fs = require 'fs'
stream = require 'stream'
util = require 'util'
should = require 'should'
produce = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'random', ->

    describe 'without seed', ->

      it 'generate different values', ->
        produce().random().should.not.equal produce().random()

      it 'generate between 0 and 1', ->
        produce().random().should.be.above 0
        produce().random().should.be.below 1

    describe 'with seed', ->

      it 'generate same values', ->
        produce(seed: 1).random().should.equal produce(seed: 1).random()

      it 'generate between 0 and 1', ->
        produce(seed: 1).random().should.be.above 0
        produce(seed: 1).random().should.be.below 1
