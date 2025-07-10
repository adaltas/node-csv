import { Options } from "./index.js";

declare function generate<T = any>(
  options: number | Options,
): string & Array<T>;
// export default generate;
export { generate, Options };
