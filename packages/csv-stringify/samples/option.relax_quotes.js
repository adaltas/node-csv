import assert from "node:assert/strict";
import { stringify } from "csv-stringify/sync";

const output = stringify([['say "hi"', "a,b", "a\nb", '"hi"']], {
  relax_quotes: true,
});

assert.equal(output, 'say "hi","a,b","a\nb","""hi"""\n');
