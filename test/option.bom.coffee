
parse = require '../lib'

describe 'Option `bom`', ->
  
  it 'preserve bom if not defined', (next) ->
    parser = parse (err, data) ->
      data.should.eql [
        ['\ufeffa', 'b', 'c']
        ['d', 'e', 'f']
      ]
      next()
    parser.write Buffer.from "\ufeffa,b,c\n"
    parser.write Buffer.from 'd,e,f'
    parser.end()
      
  it 'throw parsing error if quote follow bom', (next) ->
    parser = parse (err, data) ->
      err.message.should.eql 'Invalid opening quote at line 1'
      next()
    parser.write Buffer.from "\ufeff\"a\",b,c\n"
    parser.write Buffer.from 'd,e,f'
    parser.end()

  it 'handle BOM', (next) ->
    parser = parse bom: true, (err, data) ->
      data.should.eql [
        ['a', 'b', 'c']
        ['d', 'e', 'f']
      ]
      next()
    parser.write Buffer.from "\ufeffa,b,c\n"
    parser.write Buffer.from 'd,e,f'
    parser.end()
    
