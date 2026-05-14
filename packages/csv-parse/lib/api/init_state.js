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
    // Basic Latin
    0x0020, // [Space](https://www.fileformat.info/info/unicode/char/0020/index.htm)
    0x0009, // [CHARACTER TABULATION (HT)](https://www.fileformat.info/info/unicode/char/0009/index.htm)
    0x000a, // [LINE FEED (LF)](https://www.fileformat.info/info/unicode/char/000a/index.htm)
    0x000d, // [CARRIAGE RETURN (CR)](https://www.fileformat.info/info/unicode/char/000d/index.htm)
    0x000c, // [FORM FEED (FF)](https://www.fileformat.info/info/unicode/char/000c/index.htm)
    0x000b, // [LINE TABULATION (VT)](https://www.fileformat.info/info/unicode/char/000b/index.htm)
    // Latin-1 Supplement
    0x00a0, // [NO-BREAK SPACE (NBSP)](https://www.fileformat.info/info/unicode/char/00a0/index.htm)
    // Ogham
    0x1680, // [OGHAM SPACE MARK](https://www.fileformat.info/info/unicode/char/1680/index.htm)
    // General Punctuation
    0x2000, // [EN QUAD](https://www.fileformat.info/info/unicode/char/2000/index.htm)
    0x2001, // [EM QUAD](https://www.fileformat.info/info/unicode/char/2001/index.htm)
    0x2002, // [EN SPACE](https://www.fileformat.info/info/unicode/char/2002/index.htm)
    0x2003, // [EM SPACE](https://www.fileformat.info/info/unicode/char/2003/index.htm)
    0x2004, // [THREE-PER-EM SPACE](https://www.fileformat.info/info/unicode/char/2004/index.htm)
    0x2005, // [FOUR-PER-EM SPACE](https://www.fileformat.info/info/unicode/char/2005/index.htm)
    0x2006, // [SIX-PER-EM SPACE](https://www.fileformat.info/info/unicode/char/2006/index.htm)
    0x2007, // [FIGURE SPACE](https://www.fileformat.info/info/unicode/char/2007/index.htm)
    0x2008, // [PUNCTUATION SPACE](https://www.fileformat.info/info/unicode/char/2008/index.htm)
    0x2009, // [THIN SPACE](https://www.fileformat.info/info/unicode/char/2009/index.htm)
    0x200a, // [HAIR SPACE](https://www.fileformat.info/info/unicode/char/200a/index.htm)
    0x2028, // [LINE SEPARATOR](https://www.fileformat.info/info/unicode/char/2028/index.htm)
    0x2029, // [PARAGRAPH SEPARATOR](https://www.fileformat.info/info/unicode/char/2029/index.htm)
    0x202f, // [NARROW NO-BREAK SPACE (NNBSP)](https://www.fileformat.info/info/unicode/char/202f/index.htm)
    0x205f, // [MEDIUM MATHEMATICAL SPACE (MMSP)](https://www.fileformat.info/info/unicode/char/205f/index.htm)
    0x3000, // [IDEOGRAPHIC SPACE](https://www.fileformat.info/info/unicode/char/3000/index.htm)
    0xfeff, // [ZERO WIDTH NO-BREAK SPACE (BOM)](https://www.fileformat.info/info/unicode/char/feff/index.htm)
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
    delimiterBufPrevious: undefined,
    delimiterDiscovered: false,
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
      ...(options.delimiter
        ? options.delimiter.map((delimiter) => delimiter.length)
        : []),
      // Auto discovery of delimiter is limited to 1 character
      options.delimiter_auto ? 1 : 0,
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
