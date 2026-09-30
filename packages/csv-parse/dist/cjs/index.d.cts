// Original definitions in https://github.com/DefinitelyTyped/DefinitelyTyped by: David Muller <https://github.com/davidm77>

/// <reference types="node" />

import * as stream from "stream";
import type { CsvError } from "./api/CsvError.cjs";
export type * from "./options.cjs";
import type {
  // Info
  Info,
  InfoCallback,
  // Options
  Options as OptionsOriginal,
  OptionsNormalized as OptionsNormalizedOriginal,
  OptionsWithColumns as OptionsWithColumnsOriginal,
} from "./options.cjs";

export * from "./api/CsvError.cjs";

export interface Options<T = string[], U = T>
  extends OptionsOriginal<T, U>, Omit<stream.TransformOptions, "encoding"> {}

export interface OptionsNormalized<T = string[], U = T>
  extends
    OptionsNormalizedOriginal<T, U>,
    Omit<stream.TransformOptions, "encoding"> {}

export interface OptionsWithColumns<T, U = T>
  extends
    OptionsWithColumnsOriginal<T, U>,
    Omit<stream.TransformOptions, "encoding"> {}

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
