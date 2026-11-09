import assert from "node:assert/strict";
import { stringify } from "csv-stringify/sync";

const output = stringify(
  [['relax "quotes"', "I,contain,delimiters", '"I"contain"quotes"']],
  {
    relax_quotes: true,
  },
);

assert.equal(
  output,
  'relax "quotes","I,contain,delimiters","""I""contain""quotes"""\n',
);
