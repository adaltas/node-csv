import { Options } from "./index.js";

type OptionsWithColumns<T, U> = Omit<Options<T>, "columns"> & {
  columns: Exclude<Options["columns"], undefined | false>;
};

declare function parse<T = unknown, U = T>(
  input: Buffer | string | Uint8Array,
  options: OptionsWithColumns<T, U>,
): U[];
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
  Info,
  InfoCallback,
  InfoDataSet,
  InfoRecord,
  InfoField,
  CsvErrorCode,
  CsvError,
} from "./index.js";
