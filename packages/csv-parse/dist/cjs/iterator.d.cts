import type {
  Options,
  OptionsWithColumns,
  OptionsNormalized,
} from "./options.cjs";

declare function parse<T = unknown, U = T>(
  input: AsyncIterable<string | Uint8Array>,
  options: OptionsWithColumns<T, U>,
): AsyncGenerator<T, void, unknown>;
declare function parse<T = string[], U = T>(
  input: AsyncIterable<string | Uint8Array>,
  options?: Options<T, U>,
): AsyncGenerator<T, void, unknown>;

declare function normalize_options(options: Options): OptionsNormalized;

export { parse, normalize_options };
export * from "./api/CsvError.cjs";
export type * from "./options.cjs";
