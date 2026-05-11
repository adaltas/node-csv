import ResizeableBuffer from "../utils/ResizeableBuffer.js";

const init_state = function (options) {
  // ECMAScript WhiteSpace + LineTerminator codepoints, encoded under
  // `options.encoding`. Aligns trimming with `String.prototype.trim()`.
  // https://tc39.es/ecma262/#sec-white-space
  // https://tc39.es/ecma262/#sec-line-terminators
  //
  // Codepoints unrepresentable in the target encoding are dropped: Node's
  // Buffer substitutes them with `?` (0x3F), and including those would cause
  // literal `?` bytes in the input to be trimmed under `latin1`/`ascii`.
  const timchars = [
    0x0020, 0x0009, 0x000a, 0x000d, 0x000c, 0x000b, 0x00a0, 0x1680, 0x2000,
    0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009,
    0x200a, 0x2028, 0x2029, 0x202f, 0x205f, 0x3000, 0xfeff,
  ].reduce((acc, codepoint) => {
    const encoded = Buffer.from(
      String.fromCharCode(codepoint),
      options.encoding,
    );
    if (codepoint !== 0x3f && encoded.length === 1 && encoded[0] === 0x3f) {
      return acc;
    }
    acc.push(encoded);
    return acc;
  }, []);
  // First-byte lookup table for `__isCharTrimable`. Non-whitespace bytes
  // (the common case) bail out in O(1) without scanning every timchar.
  const timcharFirstBytes = new Uint8Array(256);
  for (const t of timchars) timcharFirstBytes[t[0]] = 1;
  return {
    bomSkipped: false,
    bufBytesStart: 0,
    castField: options.cast_function,
    commenting: false,
    // Current error encountered by a record
    error: undefined,
    enabled: options.from_line === 1,
    escaping: false,
    escapeIsQuote:
      Buffer.isBuffer(options.escape) &&
      Buffer.isBuffer(options.quote) &&
      Buffer.compare(options.escape, options.quote) === 0,
    // columns can be `false`, `true`, `Array`
    expectedRecordLength: Array.isArray(options.columns)
      ? options.columns.length
      : undefined,
    field: new ResizeableBuffer(20),
    firstLineToHeaders: options.cast_first_line_to_header,
    needMoreDataSize: Math.max(
      // Skip if the remaining buffer smaller than comment
      options.comment !== null ? options.comment.length : 0,
      // Skip if the remaining buffer can be delimiter
      ...options.delimiter.map((delimiter) => delimiter.length),
      // Skip if the remaining buffer can be escape sequence
      options.quote !== null ? options.quote.length : 0,
      // Skip if the remaining buffer can be a multi-byte trim character
      ...timchars.map((t) => t.length),
    ),
    previousBuf: undefined,
    quoting: false,
    stop: false,
    rawBuffer: new ResizeableBuffer(100),
    record: [],
    recordHasError: false,
    record_length: 0,
    recordDelimiterMaxLength:
      options.record_delimiter.length === 0
        ? 0
        : Math.max(...options.record_delimiter.map((v) => v.length)),
    trimChars: [
      Buffer.from(" ", options.encoding)[0],
      Buffer.from("\t", options.encoding)[0],
    ],
    wasQuoting: false,
    wasRowDelimiter: false,
    timchars: timchars,
    timcharFirstBytes: timcharFirstBytes,
  };
};

export { init_state };
