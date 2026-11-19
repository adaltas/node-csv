import assert from "node:assert/strict";
import { parse, normalize_options } from "../lib/index.js";
import { parse as parseSync } from "../lib/sync.js";

describe("Option `quote` with an empty Buffer", function () {
  for (const [input, expected] of [
    [",", [["", ""]]],
    ["\n", [[""]]],
    [",a", [["", "a"]]],
    ['"a",b', [['"a"', "b"]]],
    ["", []],
  ]) {
    it(`disables quoting for ${JSON.stringify(input)}`, function () {
      const options = { quote: Buffer.alloc(0) };
      // Assert normalization first so a regression cannot enter a zero-length
      // quote loop while testing delimiter-only input.
      assert.equal(normalize_options(options).quote, null);
      assert.deepEqual(parseSync(input, options), expected);
      assert.deepEqual(parseSync(input, { quote: "" }), expected);
    });
  }

  it("disables quoting for byte-sized stream writes", async function () {
    const options = { quote: Buffer.alloc(0) };
    assert.equal(normalize_options(options).quote, null);
    const input = Buffer.from(',"a"\n,b');
    const records = await new Promise((resolve, reject) => {
      const parser = parse(options, (err, records) => {
        if (err) return reject(err);
        resolve(records);
      });
      for (let i = 0; i < input.length; i++) {
        parser.write(input.subarray(i, i + 1));
      }
      parser.end();
    });
    assert.deepEqual(records, [
      ["", '"a"'],
      ["", "b"],
    ]);
  });
});
