
import { Options } from './index';

declare function parse(input: Buffer | string, options?: Options): any;
// export default parse;
export { parse };

export {
  CastingContext, CastingFunction, CastingDateFunction,
  ColumnOption, Options, Info, CsvErrorCode, CsvError
} from './index';
