
import 'should'
import {
  parse,
  CastingContext, CastingFunction, CastingDateFunction,
  ColumnOption, Options, Info, CsvErrorCode, CsvError
} from '../lib/sync.js'

describe('API Types', () => {
  
  it('respect parse signature', () => {
    // No argument
    parse("")
    parse("", {})
    parse(Buffer.from(""))
    parse(Buffer.from(""), {})
  })
  
  it('return records', () => {
    try {
      const records: object = parse("")
      typeof records
    }catch (err){
      if (err instanceof CsvError){
        err.message
      }
    }
  })
  
  it('Options', () => {
    (options: Options) => {
      const bom: boolean | undefined = options.bom;
      return [bom]
    }
  })
  
  it('CastingContext', () => {
    const options: Options = {
      cast: (value: string, context: CastingContext) => {
        return `${value} ${context.index}`
      }
    }
    return options;
  })
  
  it('CastingDateFunction', () => {
    const castDate: CastingDateFunction = (value: string, context: CastingContext) => {
      return new Date(`${value} ${context.index}`)
    }
    const options: Options = {
      cast_date: castDate
    }
    return options;
  })
  
  it('CastingFunction', () => {
    const cast: CastingFunction = (value: string, context: CastingContext) => {
      return `${value} ${context.index}`
    };
    const options: Options = {
      cast: cast
    };
    return options;
  })
  
  it('ColumnOption', () => {
    const column: ColumnOption = {name: 'sth'};
    const options: Options = {
      columns: [column]
    }
    return options;
  })
  
  it('CsvErrorCode', () => {
    const err = new CsvError('CSV_INCONSISTENT_RECORD_LENGTH', 'error');
    const code: CsvErrorCode = err.code;
    return code;
  })
  
  it('Info', () => {
    const info: Info = {
      comment_lines: 1,
      empty_lines: 1,
      lines: 1,
      records: 1,
      bytes: 1,
      invalid_field_length: 1,
    };
    return info;
  })
  
})
