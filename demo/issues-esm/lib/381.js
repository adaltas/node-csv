import assert from "assert";
import { parse } from "csv-parse/sync";

const records = parse(
  [
    '"Code","Name","Age"',
    '"1234567890AB","Works",123',
    '"123456789012","Doesn\'t",123`',
  ].join("\n"),
  { columns: true, cast: true }
);

console.log(records);
assert.deepStrictEqual(records, [
  { Code: "1234567890AB", Name: "Works", Age: 123 },
  { Code: 123456789012, Name: "Doesn't", Age: "123`" },
]);
