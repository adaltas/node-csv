/** The Buffer methods exposed by the browser bundle's byte-valued options. */
export interface Buffer extends Uint8Array {
  equals(otherBuffer: Uint8Array): boolean;
  toString(encoding?: BufferEncoding, start?: number, end?: number): string;
}

export type BufferEncoding =
  | "ascii"
  | "utf8"
  | "utf-8"
  | "utf16le"
  | "utf-16le"
  | "ucs2"
  | "ucs-2"
  | "base64"
  | "latin1"
  | "binary"
  | "hex";
