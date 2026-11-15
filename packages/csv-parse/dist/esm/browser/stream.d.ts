import type { Options, OptionsNormalized } from "./options.js";

/** Parse byte chunks with the browser's native Web Streams API. */
declare function parse(options?: Options): TransformStream<Uint8Array, unknown>;
declare function normalize_options(options: Options): OptionsNormalized;

export { parse, normalize_options };
export type * from "./options.js";
export * from "./api/CsvError.js";
