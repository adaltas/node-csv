/// <reference types="node" />

import * as stream from "stream";

export type Handler<T = unknown, U = unknown> = (
  record: T,
  callback: HandlerCallback,
  params?: unknown,
) => U;
export type HandlerCallback<T = unknown> = (
  err?: null | Error,
  record?: T,
) => void;
export type Callback = (err?: null | Error, output?: string) => void;

export interface Options extends stream.TransformOptions {
  /**
   * In the absence of a consumer, like a `stream.Readable`, trigger the consumption of the stream.
   */
  consume?: boolean;
  /**
   * The number of transformation callbacks to run in parallel; only apply with asynchronous handlers; default to "100".
   */
  parallel?: number;
  /**
   * Pass user defined parameters to the user handler as last argument.
   */
  params?: unknown;
}
export interface State {
  finished: number;
  running: number;
  started: number;
}
export class Transformer extends stream.Transform {
  constructor(options: Options);
  readonly options: Options;
  readonly state: State;
}

declare function transform<T = unknown, U = unknown>(
  handler: Handler<T, U>,
  callback?: Callback,
): Transformer;
declare function transform<T = unknown, U = unknown>(
  records: Array<T>,
  handler: Handler<T, U>,
  callback?: Callback,
): Transformer;
declare function transform<T = unknown, U = unknown>(
  options: Options,
  handler: Handler<T, U>,
  callback?: Callback,
): Transformer;
declare function transform<T = unknown, U = unknown>(
  records: Array<T>,
  options: Options,
  handler: Handler<T, U>,
  callback?: Callback,
): Transformer;

export default transform;
export { transform };
