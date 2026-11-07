import assert from "node:assert/strict";
import { parse } from "csv-parse/iterator";

async function* chunks() {
  yield "name,age\nAlice,";
  yield new TextEncoder().encode("20\nBob,30");
}

const records = [];
for await (const record of parse(chunks(), { columns: true, cast: true })) {
  records.push(record);
}
assert.deepEqual(records, [
  { name: "Alice", age: 20 },
  { name: "Bob", age: 30 },
]);
