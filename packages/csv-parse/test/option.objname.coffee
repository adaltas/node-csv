
import parse from '../lib/index.js'

describe 'Option `objname`', ->
  
  it 'validation', ->
    parse '', objname: 'sth', (->)
    parse '', objname: Buffer.from('sth'), (->)
    parse '', objname: null, (->)
    parse '', objname: undefined, (->)
    (->
      parse '', objname: '', (->)
    ).should.throw 'Invalid Option: objname must be a non empty string'
    (->
      parse '', objname: Buffer.from(''), (->)
    ).should.throw 'Invalid Option: objname must be a non empty buffer'
    (->
      parse '', objname: true, (->)
    ).should.throw 'Invalid Option: objname must be a string or a buffer, got true'
  
  it 'convert a buffer to a column name', (next) ->
    parse """
    a,b,c
    """, objname: Buffer.from('h1'), columns: ['h1', 'h2', 'h3'], (err, data) ->
      data.should.eql(
        'a':
          'h1': 'a'
          'h2': 'b'
          'h3': 'c'
      ) unless err
      next err
      

  it 'should print object of objects with properties using value of given column from columns', (next) ->
    parse """
    20322051544,1979,8.8017226E7,ABC,45,2000-01-01
    28392898392,1974,8.8392926E7,DEF,23,2050-11-27
    """, objname: "FIELD_1", columns: ["FIELD_1", "FIELD_2", "FIELD_3", "FIELD_4", "FIELD_5", "FIELD_6"], (err, data) ->
      data.should.eql(
        "20322051544":
          "FIELD_1":"20322051544"
          "FIELD_2":"1979"
          "FIELD_3":"8.8017226E7"
          "FIELD_4":"ABC"
          "FIELD_5":"45"
          "FIELD_6":"2000-01-01"
        ,
        "28392898392":
          "FIELD_1":"28392898392"
          "FIELD_2":"1974"
          "FIELD_3": "8.8392926E7"
          "FIELD_4":"DEF"
          "FIELD_5":"23"
          "FIELD_6":"2050-11-27"
      ) unless err
      next err

  it 'should print object of objects with properties using value of given column from header record', (next) ->
    parse """
    FIELD_1,FIELD_2,FIELD_3,FIELD_4,FIELD_5,FIELD_6
    20322051544,1979,8.8017226E7,ABC,45,2000-01-01
    28392898392,1974,8.8392926E7,DEF,23,2050-11-27
    """, objname: "FIELD_1", columns: true, (err, data) ->
      return next err if err
      data.should.eql "20322051544":
        "FIELD_1":"20322051544"
        "FIELD_2":"1979"
        "FIELD_3":"8.8017226E7"
        "FIELD_4":"ABC"
        "FIELD_5":"45"
        "FIELD_6":"2000-01-01"
      ,
      "28392898392":
        "FIELD_1":"28392898392"
        "FIELD_2":"1974"
        "FIELD_3": "8.8392926E7"
        "FIELD_4":"DEF"
        "FIELD_5":"23"
        "FIELD_6":"2050-11-27"
      next()
