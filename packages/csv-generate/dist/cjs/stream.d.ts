
import { Options } from './index';

declare function generate(options?: Options): ReadableStream<Buffer>;
// export default generate;
export { generate, Options };
