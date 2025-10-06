import { Options } from "./index.js";

declare function parse(options?: Options): TransformStream;
// export default parse;
export { parse };

export {
  CastingContext, // Deprecated
  CastingFunction,
  CastingDateFunction,
  ColumnOption,
  Options,
  OptionsNormalized,
  OptionsWithColumns,
  Info,
  InfoCallback,
  InfoDataSet,
  InfoRecord,
  InfoField,
  CsvErrorCode,
  CsvError,
} from "./index.js";
