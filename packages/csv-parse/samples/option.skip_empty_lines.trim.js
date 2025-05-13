import assert from "node:assert";
import { parse } from "csv-parse/sync";

const data = `
"a","b","c"
\t
"d","e","f"
`;
const records = parse(data, {
  skip_empty_lines: true,
  trim: true,
});

assert.deepStrictEqual(records, [
  ["a", "b", "c"],
  ["d", "e", "f"],
]);
