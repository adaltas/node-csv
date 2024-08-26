import assert from "node:assert";
import { parse } from "csv-parse/sync";

const data = `a,"b""c",d`;
const records = parse(data);
assert.deepStrictEqual(records, [["a", 'b"c', "d"]]);
