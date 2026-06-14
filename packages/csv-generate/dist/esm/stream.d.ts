import { Options } from "./index.js";

declare function generate(options?: Options): ReadableStream<Buffer>;

export { generate, Options };
