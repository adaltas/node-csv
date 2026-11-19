import assert from "node:assert/strict";
import { parse } from "../lib/index.js";
import { parse as parseSync } from "../lib/sync.js";

describe("Option `rtrim` with Buffer fields", function () {
  for (const encoding of [null, false]) {
    for (const trimOption of ["rtrim", "trim"]) {
      it(`preserves bytes with encoding=${encoding} and ${trimOption}`, async function () {
        const binary = Buffer.from([0xff, 0xfe, 0xa0]);
        const input = Buffer.concat([
          Buffer.from(' \ta\u2003 ," b "\n'),
          binary,
          Buffer.from("\u00a0, \t"),
        ]);
        const options = { encoding, [trimOption]: true };
        const expected = [
          [
            Buffer.from(trimOption === "trim" ? "a" : " \ta"),
            Buffer.from(" b "),
          ],
          [binary, Buffer.alloc(0)],
        ];
        assert.deepEqual(parseSync(input, options), expected);
        const records = await new Promise((resolve, reject) => {
          const parser = parse(options, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          });
          for (const byte of input) parser.write(Buffer.from([byte]));
          parser.end();
        });
        assert.deepEqual(records, expected);
      });
    }

    it(`preserves quoted whitespace with encoding=${encoding}`, function () {
      assert.deepEqual(
        parseSync('" a\u2003"," \t "', { encoding, rtrim: true }),
        [[Buffer.from(" a\u2003"), Buffer.from(" \t ")]],
      );
    });
  }
});
