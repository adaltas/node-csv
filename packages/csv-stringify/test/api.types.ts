
import 'should'
import * as stringify from '../lib/index'
import {CastingContext, Options, Stringifier} from '../lib/index'

describe('API Types', () => {
  
  describe('Parser', () => {
    
    it('Expose options', () => {
      const stringifier: Stringifier = stringify()
      const options: Options = stringifier.options
      const keys: any = Object.keys(options)
      keys.sort().should.eql([
        'bom', 'cast', 'columns', 'delimiter', 'eof', 'escape',
        'header', 'quote', 'quoted', 'quoted_empty',
        'quoted_match', 'quoted_string', 'record_delimiter'
      ])
    })
    
    it('Receive Callback', (next) => {
      stringify([['a'], ['b']], function(err: Error | undefined, output: string){
        if(err !== undefined){
          output.should.eql('a\nb')
        }
        next(err)
      })
    })
    
  })
  
  describe('Options', () => {
    
    it('bom', () => {
      const options: Options = {}
      options.bom = true
    })
    
    it('cast', () => {
      const options: Options = {}
      options.cast = {
        boolean: (value: boolean) => {
          return value ? 'true': 'false'
        },
        date: (value: Date) => {
          return value ? 'true': 'false'
        },
        number: (value: number) => {
          return value ? 'true': 'false'
        },
        object: (value: object) => {
          return value ? 'true': 'false'
        },
        string: (value: string) => {
          return value ? 'true': 'false'
        },
      }
    })
      
    it('columns', () => {
      const options: Options = {}
      options.columns = [
        'b',
        'a'
      ]
      options.columns = [
        { key: 'b' },
        { key: 'a' }
      ]
      options.columns = {
        field1: 'column1',
        field3: 'column3'
      }
    })
    
    it('delimiter', () => {
      const options: Options = {}
      options.delimiter = ':'
      options.delimiter = Buffer.from(':')
    })
    
    it('escape', () => {
      const options: Options = {}
      options.escape = '"'
      options.escape = Buffer.from('"')
    })
    
    it('header', () => {
      const options: Options = {}
      options.header = true
    })
    
    it('quote', () => {
      const options: Options = {}
      options.quote = "\""
      options.quote = Buffer.from("\"")
      options.quote = true
      options.quote = false
    })
    
    it('quoted', () => {
      const options: Options = {}
      options.quoted = true
      options.quoted = false
    })
    
    it('quoted_empty', () => {
      const options: Options = {}
      options.quoted_empty = true
      options.quoted_empty = false
    })
    
    it('quoted_match', () => {
      const options: Options = {}
      options.quoted_match = "\""
      options.quoted_match = /\"/
    })
    
    it('quoted_string', () => {
      const options: Options = {}
      options.quoted_string = true
      options.quoted_string = false
    })
    
    it('record_delimiter', () => {
      const options: Options = {}
      options.record_delimiter = '|'
      options.record_delimiter = Buffer.from('|')
    })
    
  })
  
  describe('CastingContext', () => {
    
    it('all properties', () => {
      (context: CastingContext) => {
        const column: number|string|undefined = context.column
        const header: boolean = context.header
        const index: number = context.index
        const records: number = context.records
        return [
          column, header, index, records
        ]
      }
    })
  })
  
})
