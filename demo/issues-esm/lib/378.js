import assert from "assert";
import { stringify } from "csv-stringify/sync";
import { parse } from "csv-parse/sync";

const a = [
  { id: 1, value: false },
  { id: 2, value: true },
];
const result = stringify(a, { header: true });
const records = parse(result, {
  columns: true,
  skip_empty_lines: true,
  cast: (value, { header, column }) =>
    header
      ? value
      : column === "id"
        ? parseInt(value) // Cast inteter as number
        : column === "value"
          ? !!value // Cast value as boolean
          : value, // Don't cast additionnal fields
});
assert.deepEqual(records, [
  { id: 1, value: false },
  { id: 2, value: true },
]);
