
should = require 'should'
generate = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'option seed', ->

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

      it 'generate data with highWaterMark', (next) ->
        @timeout 1000000
        count = 0
        data = []
        generator = generate seed: 1, highWaterMark: 32
        generator.on 'readable', ->
          while d = generator.read()
            data.push d
            generator.end() if count++ is 2
        generator.on 'error', next
        generator.on 'end', ->
          data.join('').trim().should.eql """
          OMH,ONKCHhJmjadoA,D,GeACHiN,nnmiN,CGfDKB,NIl,JnnmjadnmiNL
          KB,dmiM,fENL,Jn,opEMIkdmiOMFckep,MIj,bgIjadnn,fENLEOMIkbhLDK
          B,LF,gGeBFaeAC,iLEO,IkdoAAC,hKpD,opENJ,opDLENLDJoAAABFP
          iNJnmjPbhL,Ik,jPbhKCHhJn,fDKCHhIkeAABEM,kdnlh,DKACIl,HgGdoABEMIjP,adlhKCGf
          """
          next()
