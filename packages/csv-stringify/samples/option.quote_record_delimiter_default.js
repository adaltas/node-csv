import { stringify } from "csv-stringify/sync";
import assert from "node:assert";

// A carriage return inside a field is quoted by default
const records = stringify([["a\rb"], ["c\nd"], ["e::f"]], { eof: false });

assert.equal(records, '"a\rb"\n"c\nd"\ne::f');
