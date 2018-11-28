
import 'should'
import * as generate from '../lib/index'
import {Options, Generator} from '../lib/index'

describe('API Types', () => {
  
  describe('Generator', () => {
  
    it('Expose options', () => {
      const generator: Generator = generate()
      const options: Options = generator.options
      const keys: any = Object.keys(options)
      keys.sort().should.eql([
        'columns', 'delimiter', 'duration', 'encoding', 'end', 'eof',
        'fixedSize', 'length', 'maxWordLength', 'rowDelimiter', 'seed', 'sleep'
      ])
    })
  
    it('Receive Callback', (next) => {
      generate({length: 3}, function(err: Error, data: object){
        if(err !== undefined){
          data.should.be.an.Object()
        }
        next(err)
      })
    })
  
  })
  
  describe('Options', () => {
    
    it('columns', () => {
      const options: Options = {}
      options.columns = 8
      options.columns = ['ascii', 'bool', 'int']
    })
      
    it('delimiter', () => {
      const options: Options = {}
      options.delimiter = '|'
    })
      
    it('duration', () => {
      const options: Options = {}
      options.duration = 1000
    })
      
    it('encoding', () => {
      const options: Options = {}
      options.encoding = 'utf8'
    })
      
    it('end', () => {
      const options: Options = {}
      options.end = 1000
      options.end = new Date()
    })
      
    it('eof', () => {
      const options: Options = {}
      options.eof = true
      options.eof = '\n'
    })
      
    it('fixed_size', () => {
      const options: Options = {}
      options.fixed_size = true
    })
      
    it('high_water_mark', () => {
      const options: Options = {}
      options.high_water_mark = 1024
    })
      
    it('length', () => {
      const options: Options = {}
      options.length = 100
    })
      
    it('max_word_length', () => {
      const options: Options = {}
      options.length = 10
    })
      
    it('object_mode', () => {
      const options: Options = {}
      options.object_mode = true
    })
      
    it('row_delimiter', () => {
      const options: Options = {}
      options.row_delimiter = ';'
    })
      
    it('seed', () => {
      const options: Options = {}
      options.seed = 10
    })
      
    it('sleep', () => {
      const options: Options = {}
      options.sleep = 1000
    })
    
  })
  
})
