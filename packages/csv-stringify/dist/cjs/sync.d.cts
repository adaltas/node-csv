
import { Input, Options } from './index.cjs'

declare function stringify(input: Input, options?: Options): string

// export default stringify;
export { stringify };

export {
  RecordDelimiter, Cast, PlainObject, Input, ColumnOption, CastingContext,
  Options
} from './index.cjs';
