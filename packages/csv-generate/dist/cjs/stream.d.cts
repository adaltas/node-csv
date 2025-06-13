import { Options } from "./index.cjs";

declare function generate(options?: Options): ReadableStream<Buffer>;
// export default generate;
export { generate, Options };
