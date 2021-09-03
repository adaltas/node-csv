
import 'should'
import parse, {CastingContext, Info, Options, Parser, CsvError} from '../lib/index.js'
import parse_sync from '../lib/sync.js'

describe('API Types', () => {
  
  describe('stream/callback API', () => {
    
    it('respect parse signature', () => {
      // No argument
      parse()
      parse("")
      parse("", () => {})
      parse("", {})
      parse("", {}, () => {})
      parse(Buffer.from(""))
      parse(Buffer.from(""), () => {})
      parse(Buffer.from(""), {})
      parse(Buffer.from(""), {}, () => {})
      parse(() => {})
      parse({})
      parse({}, () => {})
    })

    it('Expose options', () => {
      const parser: Parser = parse()
      const options: Options = parser.options
      const keys: string[] = Object.keys(options)
      keys.sort().should.eql([
        'bom', 'cast', 'cast_date', 'columns', 'columns_duplicates_to_array',
        'comment', 'delimiter', 'encoding', 'escape', 'from', 'from_line',
        'ignore_last_delimiters', 'info', 'ltrim', 'max_record_size', 'objname',
        'on_record', 'quote', 'raw', 'record_delimiter', 'relax',
        'relax_column_count', 'relax_column_count_less',
        'relax_column_count_more', 'rtrim', 'skip_empty_lines',
        'skip_lines_with_empty_values', 'skip_lines_with_error', 'to',
        'to_line', 'trim'
      ])
    })
      
    it('Expose info', () => {
      const parser: Parser = parse()
      const info: Info = parser.info
      const keys: string[] = Object.keys(info)
      keys.sort().should.eql([
        'bytes',
        'comment_lines', 'empty_lines',
        'invalid_field_length', 'lines', 'records'
      ])
    })
    
    it('Receive Callback', (next) => {
      parse('a\nb', function(err: Error|undefined, records: object, info: Info){
        if(err !== undefined){
          records.should.eql([['a'], ['b']])
          info.records.should.eql(2)
        }
        next(err)
      })
    })
    
  })
  
  describe('sync api', () => {
  
    it('respect parse signature', () => {
      // No argument
      parse_sync("")
      parse_sync("", {})
      parse_sync(Buffer.from(""))
      parse_sync(Buffer.from(""), {})
    })
    
    it('return records', () => {
      try {
        const data: object = parse_sync("")
        typeof data
      }catch (err){
        if (err instanceof CsvError){
          err.message
        }
      }
    })
    
  })
  
  describe('Info', () => {
    
    const fakeinfo = {
      bytes: 1,
      comment_lines: 1, empty_lines: 1,
      invalid_field_length: 1, lines: 1, records: 1
    }
    
    it('bytes', () => {
      const info: Info = fakeinfo
      const bytes: number = info.bytes
      bytes
    })

    it('comment_lines', () => {
      const info: Info = fakeinfo
      const comment_lines: number = info.comment_lines
      comment_lines
    })
    
    it('empty_lines', () => {
      const info: Info = fakeinfo
      const empty_lines: number = info.empty_lines
      empty_lines
    })
      
    it('lines', () => {
      const info: Info = fakeinfo
      const lines: number = info.lines
      lines
    })
    
    it('records', () => {
      const info: Info = fakeinfo
      const records: number = info.records
      records
    })
      
    it('invalid_field_length', () => {
      const info: Info = fakeinfo
      const invalid_field_length: number = info.invalid_field_length
      invalid_field_length
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
      options.castDate = true
    })
      
    it('columns', () => {
      const options: Options = {}
      options.columns = true
      options.columns = []
      options.columns = ['string', undefined, null, false, {name: 'column-name'}]
      options.columns = (record: string[]) => {
        const fields: string[] = record.map( (field: string) => {
          return field.toUpperCase()
        })
        return fields
      }
      options.columns = (record: string[]) => {
        record
        return ['string', undefined, null, false, {name: 'column-name'}]
      }
    })
      
    it('columns_duplicates_to_array', () => {
      const options: Options = {}
      options.columns_duplicates_to_array = true
      options.columnsDuplicatesToArray = true
    })
      
    it('comment', () => {
      const options: Options = {}
      options.comment = '\\'
    })
    
    it('delimiter', () => {
      const options: Options = {}
      options.delimiter = ':'
      options.delimiter = [':', ')']
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
      options.fromLine = 10
    })
    
    it('ignore_last_delimiters', () => {
      const options: Options = {}
      options.ignore_last_delimiters = true
      options.ignore_last_delimiters = 1
    })
    
    it('info', () => {
      const options: Options = {}
      options.info = true
    })
    
    it('ltrim', () => {
      const options: Options = {}
      options.ltrim = true
    })
    
    it('max_record_size', () => {
      const options: Options = {}
      options.max_record_size = 100
      options.maxRecordSize = 100
    })
    
    it('objname', () => {
      const options: Options = {}
      options.objname = 'name'
    })
    
    it('on_record', () => {
      const options: Options = {}
      options.on_record = (record, {lines}) =>
        [lines, record[0]]
      options.onRecord = (record, {lines}) =>
        [lines, record[0]]
    })
    
    it('quote', () => {
      const options: Options = {}
      options.quote = '"'
      options.quote = true
      options.quote = Buffer.from('"')
      options.quote = null
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
      options.relaxColumnCount = true
      options.relax_column_count_less = true
      options.relaxColumnCountLess = true
      options.relax_column_count_more = true
      options.relaxColumnCountMore = true
    })
    
    it('record_delimiter', () => {
      const options: Options = {}
      options.record_delimiter = '\n'
      options.record_delimiter = ['\n']
      options.record_delimiter = Buffer.from('\n')
      options.record_delimiter = [Buffer.from('\n')]
      options.recordDelimiter = '\n'
    })
    
    it('rtrim', () => {
      const options: Options = {}
      options.rtrim = true
    })
    
    it('skip_empty_lines', () => {
      const options: Options = {}
      options.skip_empty_lines = true
      options.skipEmptyLines = true
    })
    
    it('skip_empty_lines', () => {
      const options: Options = {}
      options.skip_empty_lines = true
      options.skipEmptyLines = true
    })
    
    it('skip_lines_with_empty_values', () => {
      const options: Options = {}
      options.skip_lines_with_empty_values = true
      options.skipLinesWithEmptyValues = true
    })
    
    it('skip_lines_with_error', () => {
      const options: Options = {}
      options.skip_empty_lines = true
      options.skipEmptyLines = true
    })
    
    it('to', () => {
      const options: Options = {}
      options.to = 10
    })
    
    it('to_line', () => {
      const options: Options = {}
      options.to_line = 10
      options.toLine = 10
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
  
  describe('CsvError', () => {
    describe('Typescript definition is accurate', () => {
      it('Minimum', () => {
        const error = new CsvError("CSV_INCONSISTENT_RECORD_LENGTH", "MESSAGE");
        
        error.code.should.eql("CSV_INCONSISTENT_RECORD_LENGTH")
        error.message.should.eql("MESSAGE")
      })

      it('Multiple messages', () => {
        const error = new CsvError("CSV_INCONSISTENT_RECORD_LENGTH", ["MESSAGE1", "MESSAGE2"])

        error.code.should.eql("CSV_INCONSISTENT_RECORD_LENGTH")
        error.message.should.eql("MESSAGE1 MESSAGE2")
      })

      it('Supports contexts', () => {
        const error = new CsvError("CSV_INCONSISTENT_RECORD_LENGTH", "MESSAGE", {}, { testContext: { testProp: "testValue" } })

        error.code.should.eql("CSV_INCONSISTENT_RECORD_LENGTH")
        error.message.should.eql("MESSAGE")
        error.should.have.key("testContext").and.eql({ testProp: "testValue" })
      })
    })

    it('Proper type is thrown when an error is encountered', () => {
      parse(`a,b\nc`, function (e: Error|undefined) {
        const isCsvError = e instanceof CsvError;
        isCsvError.should.be.true();
        (e as CsvError).code.should.eql('CSV_INCONSISTENT_RECORD_LENGTH');
      })
    })
  })
})
