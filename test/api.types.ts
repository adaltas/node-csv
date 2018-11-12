
import * as parse from '../lib/index'
import {CastingContext, Info, Options, Parser} from '../lib/index'

describe('API Types', () => {
  
  describe('Parser', () => {
    
    it('Expose options', () => {
      const parser: Parser = parse()
      const options: Options = parser.options
      const keys: any = Object.keys(options)
      keys.sort().should.eql([
        'cast', 'cast_date', 'columns', 'comment', 'delimiter',
        'escape', 'from', 'from_line', 'ltrim', 'max_record_size',
        'objname', 'quote', 'raw', 'readableObjectMode',
        'record_delimiter', 'relax', 'relax_column_count',
        'rtrim', 'skip_empty_lines', 'skip_lines_with_empty_values', 
        'skip_lines_with_error', 'to', 'to_line', 'trim'
      ])
    })
      
    it('Expose info', () => {
      const parser: Parser = parse()
      const info: Info = parser.info
      const keys: any = Object.keys(info)
      keys.sort().should.eql([
        'empty_lines', 'invalid_field_length', 'lines', 'records'
      ])
    })
    
  })
  
  describe('Info', () => {
    
    it('empty_lines', () => {
      const info: Info = {}
      info.empty_lines = 1
    })
      
    it('lines', () => {
      const info: Info = {}
      info.lines = 1
    })
    
    it('records', () => {
      const info: Info = {}
      info.records = 1
    })
      
    it('invalid_field_length', () => {
      const info: Info = {}
      info.invalid_field_length = 1
    })
    
  })
  
  describe('Options', () => {
    
    it('cast', () => {
      const options: Options = {}
      options.cast = true
      options.cast = () => {}
    })
      
    it('cast_date', () => {
      const options: Options = {}
      options.cast_date = true
    })
      
    it('columns', () => {
      const options: Options = {}
      options.columns = true
      options.columns = []
      options.columns = (record: string[]) => {
        const val: boolean = record.length > 1
        return val
      }
      options.columns = (record: string[]) => {
        const fields: string[] = record.map( (field: string) => {
          return field.toUpperCase()
        })
        return fields
      }
    })
      
    it('comment', () => {
      const options: Options = {}
      options.comment = '\\'
    })
    
    it('delimiter', () => {
      const options: Options = {}
      options.delimiter = ':'
      options.delimiter = Buffer.from(':')
    })
    
    it('escape', () => {
      const options: Options = {}
      options.escape = ':'
      options.escape = Buffer.from('"')
    })
    
    it('from', () => {
      const options: Options = {}
      options.from = 10
    })
    
    it('from_line', () => {
      const options: Options = {}
      options.from_line = 10
    })
    
    it('ltrim', () => {
      const options: Options = {}
      options.ltrim = true
    })
    
    it('max_record_size', () => {
      const options: Options = {}
      options.max_record_size = 100
    })
    
    it('objname', () => {
      const options: Options = {}
      options.objname = 'name'
    })
    
    it('quote', () => {
      const options: Options = {}
      options.quote = '"'
      options.quote = true
      options.quote = Buffer.from('"')
    })
    
    it('raw', () => {
      const options: Options = {}
      options.raw = true
    })
    
    it('relax', () => {
      const options: Options = {}
      options.relax = true
    })
    
    it('relax_column_count', () => {
      const options: Options = {}
      options.relax_column_count = true
    })
    
    it('record_delimiter', () => {
      const options: Options = {}
      options.record_delimiter = '\n'
      options.record_delimiter = ['\n']
      options.record_delimiter = Buffer.from('\n')
      options.record_delimiter = [Buffer.from('\n')]
    })
    
    it('rtrim', () => {
      const options: Options = {}
      options.rtrim = true
    })
    
    it('skip_empty_lines', () => {
      const options: Options = {}
      options.skip_empty_lines = true
    })
    
    it('skip_empty_lines', () => {
      const options: Options = {}
      options.skip_empty_lines = true
    })
    
    it('skip_lines_with_empty_values', () => {
      const options: Options = {}
      options.skip_lines_with_empty_values = true
    })
    
    it('skip_lines_with_error', () => {
      const options: Options = {}
      options.skip_empty_lines = true
    })
    
    it('to', () => {
      const options: Options = {}
      options.to = 10
    })
    
    it('to_line', () => {
      const options: Options = {}
      options.to_line = 10
    })
    
    it('trim', () => {
      const options: Options = {}
      options.trim = true
    })
    
  })
  
  describe('CastingContext', () => {
    
    it('all properties', () => {
      (context: CastingContext) => {
        const column: number|string = context.column
        const empty_lines: number = context.empty_lines
        const header: boolean = context.header
        const index: number = context.index
        const quoting: boolean = context.quoting
        const lines: number = context.lines
        const records: number = context.records
        const invalid_field_length: number = context.invalid_field_length
        return [
          column, empty_lines, header, index,
          quoting, lines, records, invalid_field_length
        ]
      }
    })
  })
  
})
