
import { Input, Options } from './index'

declare function stringify(input: Input, options?: Options): string

// export default stringify;
export { stringify };

export {
  RecordDelimiter, Cast, PlainObject, Input, ColumnOption, CastingContext,
  Options
} from './index';
