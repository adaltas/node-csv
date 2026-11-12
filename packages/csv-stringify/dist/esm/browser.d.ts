// Stream signatures follow rollup-plugin-node-builtins 2.1.2's bundled
// readable-stream implementation; Buffer input follows buffer-es6 4.9.3.

export interface Buffer extends Uint8Array {
  toString(encoding?: string, start?: number, end?: number): string;
  readUInt8(offset?: number, noAssert?: boolean): number;
}

// Object-mode chunks and custom events carry user-defined values.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Chunk = any;
type EventName = string | symbol;
type Listener<Context = Chunk> = (this: Context, ...args: Chunk[]) => void;
type WriteCallback = (error?: Error | null) => void;
type TransformCallback = (error?: Error | null, data?: Chunk) => void;
type WriteEntry = { chunk: Chunk; encoding: string };

declare class EventEmitter {
  setMaxListeners(count: number): this;
  getMaxListeners(): number;
  emit(event: EventName, ...args: Chunk[]): boolean;
  addListener(event: EventName, listener: Listener<this>): this;
  on(event: EventName, listener: Listener<this>): this;
  once(event: EventName, listener: Listener<this>): this;
  prependListener(event: EventName, listener: Listener<this>): this;
  prependOnceListener(event: EventName, listener: Listener<this>): this;
  removeListener(event: EventName, listener: Listener<this>): this;
  removeAllListeners(event?: EventName): this;
  listeners(event: EventName): Listener[];
  listenerCount(event: EventName): number;
  eventNames(): EventName[];
}

interface PipeDestination {
  write(chunk: Chunk): boolean;
  end(): unknown;
  on(event: EventName, listener: Listener): unknown;
  once(event: EventName, listener: Listener): unknown;
  removeListener(event: EventName, listener: Listener): unknown;
  listeners(event: EventName): Listener[];
  emit(event: EventName, ...args: Chunk[]): boolean;
  prependListener?(event: EventName, listener: Listener): unknown;
}

interface WrappedStream {
  on(event: EventName, listener: Listener): unknown;
  pause(): unknown;
  resume(): unknown;
}

export interface TransformOptions {
  highWaterMark?: number;
  objectMode?: boolean;
  readableObjectMode?: boolean;
  writableObjectMode?: boolean;
  encoding?: string;
  defaultEncoding?: string;
  decodeStrings?: boolean;
  readable?: boolean;
  writable?: boolean;
  allowHalfOpen?: boolean;
  read?(this: Transform, size: number): void;
  write?(
    this: Transform,
    chunk: Chunk,
    encoding: string,
    callback: WriteCallback,
  ): void;
  writev?(this: Transform, chunks: WriteEntry[], callback: WriteCallback): void;
  transform?(
    this: Transform,
    chunk: Chunk,
    encoding: string,
    callback: TransformCallback,
  ): void;
  flush?(this: Transform, callback: WriteCallback): void;
}

export class Transform extends EventEmitter {
  constructor(options?: TransformOptions);
  readable: boolean;
  writable: boolean;
  allowHalfOpen: boolean;

  read(size?: number): Chunk;
  push(chunk: Chunk, encoding?: string): boolean;
  unshift(chunk: Chunk): boolean;
  isPaused(): boolean;
  setEncoding(encoding: string): this;
  pipe<T extends PipeDestination>(
    destination: T,
    options?: { end?: boolean },
  ): T;
  unpipe(destination?: PipeDestination): this;
  resume(): this;
  pause(): this;
  wrap(stream: WrappedStream): this;

  write(chunk: Chunk, callback?: WriteCallback): boolean;
  write(
    chunk: Chunk,
    encoding: string | undefined,
    callback?: WriteCallback,
  ): boolean;
  cork(): void;
  uncork(): void;
  setDefaultEncoding(encoding: string): this;
  end(callback?: () => void): void;
  end(chunk: Chunk, callback?: () => void): void;
  end(chunk: Chunk, encoding: string | undefined, callback?: () => void): void;

  _read(size: number): void;
  _write(chunk: Chunk, encoding: string, callback: WriteCallback): void;
  _writev: ((chunks: WriteEntry[], callback: WriteCallback) => void) | null;
  _transform(chunk: Chunk, encoding: string, callback: TransformCallback): void;
  _flush?(callback: WriteCallback): void;
}
