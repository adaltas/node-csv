
###
Test CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)
###

fs = require 'fs'
should = require 'should'
csv = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'comment', ->

  it 'skip line starting by # by default', (next) ->
    csv()
    .from.string( """
      # skip this
      "ABC","45"
      "DEF","23"
      # and this
      "GHI","94"
      # as well as that
      """, comment: '#' )
    .to.string (result) ->
      result.should.eql """
      ABC,45
      DEF,23
      GHI,94
      """
      next()

  it 'doent apply inside quotes', (next) ->
    csv()
    .from.string( """
      "ABC","45"
      "D#noEF","23"#yes
      "GHI","94"
      """, comment: '#' )
    .to.string (result) ->
      result.should.eql """
      ABC,45
      D#noEF,23
      GHI,94
      """
      next()

  it 'is cancel if empty', (next) ->
    csv()
    .from.string( """
      abc,#,def
      1,2,3
      """, comment: '' )
    .to.string (result) ->
      result.should.eql """
      abc,#,def
      1,2,3
      """
      next()

  it 'is cancel by default', (next) ->
    csv()
    .from.string( """
      abc,#,def
      1,2,3
      """ )
    .to.string (result) ->
      result.should.eql """
      abc,#,def
      1,2,3
      """
      next()
