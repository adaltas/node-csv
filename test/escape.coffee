
should = require 'should'
stringify = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'escape', ->

  it 'only apply to quote and escape characters', (next) ->
    stringify [
      [ '20322051544','19"79.0','8.8017226E7','A"B"C','45','2000-01-01' ]
      [ '28392898392','1974.0','8.8392926E7','DEF','23','2050-11-27' ]
    ], escape: '"', eof: false, (err, data) ->
      return next err if err
      data.should.eql """
      20322051544,"19""79.0",8.8017226E7,"A""B""C",45,2000-01-01
      28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
      """
      next()

  it 'should honor the backslash escape characters', (next) ->
    stringify [
      [ '20322051544','19\"79.0','8.8017226E7','A\"B\"C','45','2000-01-01' ]
      [ '28392898392','1974.0','8.8392926E7','DEF','23','2050-11-27' ]
      [ '28392898393','1975.0','8.8392927E7','GHI\\','24','2050-11-28' ]
      [ 'escape char','and', 'quote char','in','source:','\\"' ] # actually \"
    ], escape: '\\', eof: false, (err, data) ->
      return next err if err
      data.should.eql """
      20322051544,"19\\"79.0",8.8017226E7,"A\\"B\\"C",45,2000-01-01
      28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
      28392898393,1975.0,8.8392927E7,GHI\\,24,2050-11-28
      escape char,and,quote char,in,source:,"\\\\\\\""
      """
      # for the "escape char and quote char" value we want: \\\"
      next()
