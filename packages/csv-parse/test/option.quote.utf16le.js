import assert from "node:assert/strict";
import { parse } from "../lib/index.js";
import { parse as parseSync } from "../lib/sync.js";

describe("UTF-16LE quote and escape boundaries", function () {
  const quoteValue = "\u2201\u0100";
  const escapeValue = "\u5c01\u0100";
  for (const encoding of ["utf16le", "utf-16le", "ucs2", "ucs-2", "UTF16LE"]) {
    for (const quoted of [false, true]) {
      it(`preserves unaligned quote bytes with ${encoding} and quoted=${quoted}`, function () {
        const field = quoted ? `"${quoteValue}"` : quoteValue;
        assert.deepEqual(
          parseSync(Buffer.from(`${field},b`, encoding), { encoding }),
          [[quoteValue, "b"]],
        );
      });
    }
  }

  it("preserves unaligned custom escape bytes", function () {
    assert.deepEqual(
      parseSync(Buffer.from(`"${escapeValue}",b`, "utf16le"), {
        encoding: "utf16le",
        escape: "\\",
      }),
      [[escapeValue, "b"]],
    );
  });

  it("uses absolute positions across every stream split", async function () {
    const input = Buffer.from(
      `"prefix${quoteValue}${escapeValue}",b`,
      "utf16le",
    );
    for (let split = 1; split < input.length; split++) {
      const records = await new Promise((resolve, reject) => {
        const parser = parse(
          { encoding: "utf16le", escape: "\\" },
          (err, records) => {
            if (err) return reject(err);
            resolve(records);
          },
        );
        parser.write(input.subarray(0, split));
        parser.end(input.subarray(split));
      });
      assert.deepEqual(records, [[`prefix${quoteValue}${escapeValue}`, "b"]]);
    }
  });

  it("continues to parse real quotes and escaped quotes", function () {
    assert.deepEqual(
      parseSync(Buffer.from('"a""b",c', "utf16le"), { encoding: "utf16le" }),
      [['a"b', "c"]],
    );
    assert.deepEqual(
      parseSync(Buffer.from('"a\\"b",c', "utf16le"), {
        encoding: "utf16le",
        escape: "\\",
      }),
      [['a"b', "c"]],
    );
  });
});
