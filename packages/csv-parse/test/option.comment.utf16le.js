import assert from "node:assert/strict";
import { parse } from "../lib/index.js";
import { parse as parseSync } from "../lib/sync.js";

describe("Option `comment` with UTF-16LE", function () {
  for (const encoding of ["utf16le", "utf-16le", "ucs2", "ucs-2", "UTF16LE"]) {
    it(`ignores unaligned comment bytes with ${encoding}`, function () {
      // The bytes 23 00 span two characters, rather than encoding a '#'.
      const value = "\u2301\u0100";
      const input = Buffer.from(`${value},b# ignored|# comment|c,d`, encoding);
      assert.deepEqual(
        parseSync(input, { encoding, comment: "#", record_delimiter: "|" }),
        [
          [value, "b"],
          ["c", "d"],
        ],
      );
    });
  }

  it("ignores unaligned multi-character comments", function () {
    const value = "\u2301\u2100\u0100";
    assert.deepEqual(
      parseSync(Buffer.from(`${value},b#! ignored|c,d`, "utf16le"), {
        encoding: "utf16le",
        comment: "#!",
        record_delimiter: "|",
      }),
      [
        [value, "b"],
        ["c", "d"],
      ],
    );
  });

  it("uses the BOM-detected encoding with byte-sized writes", function (next) {
    const value = "\u2301\u0100";
    const input = Buffer.from(`\ufeff${value},b# ignored|c,d`, "utf16le");
    const parser = parse(
      { bom: true, comment: "#", record_delimiter: "|" },
      (err, records) => {
        if (err) return next(err);
        assert.deepEqual(records, [
          [value, "b"],
          ["c", "d"],
        ]);
        next();
      },
    );
    for (let i = 0; i < input.length; i++) {
      parser.write(input.subarray(i, i + 1));
    }
    parser.end();
  });

  it("uses the absolute byte position across chunk boundaries", async function () {
    const value = "prefix\u2301\u0100suffix";
    const input = Buffer.from(`${value},b# ignored|c,d`, "utf16le");
    for (let split = 1; split < input.length; split++) {
      await new Promise((resolve, reject) => {
        const parser = parse(
          { encoding: "utf16le", comment: "#", record_delimiter: "|" },
          (err, records) => {
            if (err) return reject(err);
            try {
              assert.deepEqual(records, [
                [value, "b"],
                ["c", "d"],
              ]);
              resolve();
            } catch (error) {
              reject(error);
            }
          },
        );
        parser.write(input.subarray(0, split));
        parser.end(input.subarray(split));
      });
    }
  });

  it("continues to match raw binary comment buffers at any byte position", function () {
    assert.deepEqual(
      parseSync(Buffer.from("a#\0 ignored|c"), {
        encoding: null,
        comment: Buffer.from("#\0"),
        record_delimiter: "|",
      }),
      [[Buffer.from("a")], [Buffer.from("c")]],
    );
  });
});
