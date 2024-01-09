import assert from "node:assert";
import { generate, parse, transform, stringify } from "csv/sync";

// Run the pipeline
const input = generate({ seed: 1, columns: 2, length: 2 });
const rawRecords = parse(input);
const refinedRecords = transform(rawRecords, (data) =>
  data.map((value) => value.toUpperCase())
);
const output = stringify(refinedRecords);
// Print the final result
assert.equal(output, `OMH,ONKCHHJMJADOA\nD,GEACHIN\n`);
