import { Options } from "./index.js";

declare function generate<T = unknown>(
  options: number | Options,
): string & Array<T>;

export { generate, Options };
