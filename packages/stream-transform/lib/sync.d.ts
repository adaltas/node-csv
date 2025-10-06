/// <reference types="node" />

import { Options } from "./index.js";

export type Handler<T = any, U = any> = (record: T) => U;
// export default transform;
export function transform<T = any, U = any>(
  records: Array<T>,
  handler: Handler<T, U>,
): Array<U>;
export function transform<T = any, U = any>(
  records: Array<T>,
  options: Options,
  handler: Handler<T, U>,
): Array<U>;

export { Options };
