
should = require 'should'
generate = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'random', ->

    describe 'without seed', ->

      it 'generate different values', ->
        generate().random().should.not.equal generate().random()

      it 'generate between 0 and 1', ->
        generate().random().should.be.above 0
        generate().random().should.be.below 1

    describe 'with seed', ->

      it 'generate same values', ->
        generate(seed: 1).random().should.equal generate(seed: 1).random()

      it 'generate between 0 and 1', ->
        generate(seed: 1).random().should.be.above 0
        generate(seed: 1).random().should.be.below 1
