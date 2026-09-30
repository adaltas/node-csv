// Original definitions in https://github.com/DefinitelyTyped/DefinitelyTyped by: David Muller <https://github.com/davidm77>

/// <reference types="node" />

import * as stream from "stream";
import type { CsvError } from "./api/CsvError.js";
import type {
  // Info
  Info,
  InfoCallback,
  // Options
  OptionsWithColumns,
  OptionsNormalized,
  Options,
} from "./options.js";

export * from "./api/CsvError.js";
export type * from "./options.js";

export type Callback<T = string[]> = (
  err: CsvError | undefined,
  records: T[],
  info?: InfoCallback,
) => void;

export class Parser extends stream.Transform {
  constructor(options: Options);

  // __push(line: T): CsvError | undefined;
  // __push(line: any): CsvError | undefined;

  // __write(chars: any, end: any, callback: any): any;

  readonly options: OptionsNormalized;

  readonly info: Info;
}

declare function parse<T = unknown, U = T>(
  input: string | Buffer | Uint8Array,
  options: OptionsWithColumns<T, U>,
  callback?: Callback<T>,
): Parser;
declare function parse(
  input: string | Buffer | Uint8Array,
  options: Options,
  callback?: Callback,
): Parser;

declare function parse<T = unknown, U = T>(
  options: OptionsWithColumns<T, U>,
  callback?: Callback<T>,
): Parser;
declare function parse(options: Options, callback?: Callback): Parser;

declare function parse(
  input: string | Buffer | Uint8Array,
  callback?: Callback,
): Parser;
declare function parse(callback?: Callback): Parser;

export { parse };

/////////////////////////////////////////////////////// normalize_options

declare function normalize_options(opts: Options): OptionsNormalized;
export { normalize_options };
