import { Options, OptionsWithColumns } from "./index.cjs";

declare function parse<T = unknown, U = T>(
  input: Buffer | string | Uint8Array,
  options: OptionsWithColumns<T, U>,
): T[];
declare function parse(
  input: Buffer | string | Uint8Array,
  options: Options,
): string[][];
declare function parse(input: Buffer | string | Uint8Array): string[][];

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
} from "./index.cjs";
