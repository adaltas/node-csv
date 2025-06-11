import { Options } from "./index.js";

type OptionsWithColumns<T> = Omit<Options<T>, "columns"> & {
  columns: Exclude<Options["columns"], undefined | false>;
};

declare function parse<T = unknown>(
  input: Buffer | string,
  options: OptionsWithColumns<T>,
): T[];
declare function parse(input: Buffer | string, options: Options): string[][];
declare function parse(input: Buffer | string): string[][];

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
