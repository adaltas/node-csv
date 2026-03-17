/// <reference types="node" />

import { Options } from "./index.cjs";

export type Handler<T = unknown, U = unknown> = (record: T) => U;
// export default transform;
export function transform<T = unknown, U = unknown>(
  records: Array<T>,
  handler: Handler<T, U>,
): Array<U>;
export function transform<T = unknown, U = unknown>(
  records: Array<T>,
  options: Options,
  handler: Handler<T, U>,
): Array<U>;

export { Options };
