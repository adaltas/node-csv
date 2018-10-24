
generate = require '../src'

describe 'option delimiter', ->

  it 'return an array of array', (next) ->
    @timeout 1000000
    generate seed: 1, delimiter: '|', length: 4, encoding: 'ascii', (err, data) ->
      return next err if err
      data.should.eql """
      OMH|ONKCHhJmjadoA|D|GeACHiN|nnmiN|CGfDKB|NIl|JnnmjadnmiNL
      KB|dmiM|fENL|Jn|opEMIkdmiOMFckep|MIj|bgIjadnn|fENLEOMIkbhLDK
      B|LF|gGeBFaeAC|iLEO|IkdoAAC|hKpD|opENJ|opDLENLDJoAAABFP
      iNJnmjPbhL|Ik|jPbhKCHhJn|fDKCHhIkeAABEM|kdnlh|DKACIl|HgGdoABEMIjP|adlhKCGf
      """
      next()
