
import 'should'
import {
  stringify,
  RecordDelimiter, Cast, PlainObject, Input,
  ColumnOption, CastingContext,
Options
} from '../lib/sync.js'

describe('API Types', () => {

  it('stringify return string', () => {
    const input: Input = [[1,2,3]];
    const stringifier: string = stringify(input)
    stringifier
  })

  it('Options', () => {
    (options: Options) => {
      const rd: RecordDelimiter | undefined = options.record_delimiter
      const cast = options.cast
      const castBoolean : Cast<boolean> | undefined = cast?.boolean
      const columns: string[] | PlainObject<string> | ColumnOption[] | undefined = options.columns
      return [
        rd, castBoolean, columns
      ]
    }
  })
  
  it('CastingContext', () => {
    const options: Options = {
      cast: {
        boolean: (value: boolean, context: CastingContext) => {
          return `${value} ${context.index}`
        }
      }
    }
    return options
  })

  it('allows cast to return an object', () => {
    const options: Options = {
      cast: {
        boolean: (value: boolean) => ({
          value: value.toString(),
          delimiter: ';',
          quote: false
        })
      }
    }
  })
  
})
