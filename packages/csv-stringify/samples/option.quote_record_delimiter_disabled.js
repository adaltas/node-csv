import { stringify } from "csv-stringify/sync";
import assert from "node:assert";

// With quote_record_delimiter disabled, a carriage return is not quoted
const cr = stringify([["a\rb"]], {
  quote_record_delimiter: false,
  eof: false,
});
assert.equal(cr, "a\rb");

// A line feed is still quoted because it matches the default record_delimiter
const lf = stringify([["a\nb"]], {
  quote_record_delimiter: false,
  eof: false,
});
assert.equal(lf, '"a\nb"');
