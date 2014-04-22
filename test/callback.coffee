
should = require 'should'
generate = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'callback', ->

  it 'return an array of array', (next) ->
    @timeout 1000000
    generate seed: 1, objectMode: true, length: 4, (err, data) ->
      return next err if err
      data.should.eql [
        [ 'OMH','ONKCHhJmjadoA','D','GeACHiN','nnmiN','CGfDKB','NIl','JnnmjadnmiNL' ]
        [ 'KB','dmiM','fENL','Jn','opEMIkdmiOMFckep','MIj','bgIjadnn','fENLEOMIkbhLDK' ]
        [ 'B','LF','gGeBFaeAC','iLEO','IkdoAAC','hKpD','opENJ','opDLENLDJoAAABFP' ]
        [ 'iNJnmjPbhL','Ik','jPbhKCHhJn','fDKCHhIkeAABEM','kdnlh','DKACIl','HgGdoABEMIjP','adlhKCGf' ]
      ]
      next()




