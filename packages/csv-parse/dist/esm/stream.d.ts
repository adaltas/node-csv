import { Options } from "./index.js";

declare function parse(options?: Options): TransformStream;
// export default parse;
export { parse };

export {
  CastingContext,
  CastingFunction,
  CastingDateFunction,
  ColumnOption,
  Options,
  OptionsNormalized,
  Info,
  CsvErrorCode,
  CsvError,
} from "./index.js";
