import { stringify } from "csv-stringify/sync";
import assert from "node:assert";

// When record_delimiter is set, quote_record_delimiter defaults to false.
// A carriage return is not quoted because it does not match the custom delimiter.
const cr = stringify([["a\rb"]], {
  record_delimiter: "::",
  eof: false,
});
assert.equal(cr, "a\rb");

// The custom delimiter itself is always quoted.
const delim = stringify([["a::b"]], {
  record_delimiter: "::",
  eof: false,
});
assert.equal(delim, '"a::b"');
