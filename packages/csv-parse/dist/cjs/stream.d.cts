import { Options } from "./index.cjs";

declare function parse(options?: Options): TransformStream;

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
  normalize_options,
} from "./index.cjs";
