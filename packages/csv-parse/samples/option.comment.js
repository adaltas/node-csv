import assert from "node:assert";
import dedent from "dedent";
import { parse } from "csv-parse/sync";

const data = dedent`
  # At the beginning of a record
  "hello"
  "world"# At the end of a record
`;
const records = parse(data, {
  comment: "#",
});
assert.deepStrictEqual(records, [["hello"], ["world"]]);
