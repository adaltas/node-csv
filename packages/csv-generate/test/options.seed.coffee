
import { generate } from '../lib/index.js'
import { random } from '../lib/api/random.js'

describe 'Option `seed`', ->

  describe 'without seed', ->

    it 'generate different values', ->
      random(generate().options).should.not.equal random(generate().options)

    it 'generate between 0 and 1', ->
      random(generate().options).should.be.above 0
      random(generate().options).should.be.below 1

  describe 'with seed', ->

    it 'generate same values', ->
      random(generate(seed: 1).options).should.equal random(generate(seed: 1).options)

    it 'generate between 0 and 1', ->
      random(generate(seed: 1).options).should.be.above 0
      random(generate(seed: 1).options).should.be.below 1

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
        """
        next()
