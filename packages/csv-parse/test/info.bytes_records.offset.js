import assert from "node:assert/strict";
import { parse } from "../lib/index.js";

describe("info bytes_records as the last emitted record offset", function () {
  it("keeps the previous record offset throughout field casting", function (next) {
    const fieldOffsets = [];
    parse(
      "a,b\nc,d\ne,f",
      {
        cast(value, info) {
          fieldOffsets.push(info.bytes_records);
          return value;
        },
      },
      (err, records, info) => {
        if (err) return next(err);
        assert.deepEqual(fieldOffsets, [0, 0, 4, 4, 8, 8]);
        assert.equal(info.bytes, 11);
        assert.equal(info.bytes_records, 11);
        next();
      },
    );
  });

  for (const [name, input, options, expected] of [
    [
      "skipped middle record",
      "a,b\nc,d\ne,f",
      { on_record: (record) => (record[0] === "c" ? null : record) },
      11,
    ],
    [
      "skipped final record",
      "a,b\nc,d\ne,f",
      { on_record: (record) => (record[0] === "e" ? null : record) },
      8,
    ],
    ["column headers", "x,y\na,b\nc,d", { columns: true }, 11],
    ["from_line", "a,b\nc,d\ne,f", { from_line: 2 }, 11],
    ["UTF8 BOM", "\ufeffa,b\nc,d", { bom: true }, 10],
    ["no emitted records", "a,b\nc,d", { on_record: () => null }, 0],
    ["one emitted record", "a,b", {}, 3],
  ]) {
    it(`reports an absolute offset with ${name}`, function (next) {
      parse(input, options, (err, records, info) => {
        if (err) return next(err);
        assert.equal(info.bytes_records, expected);
        assert.ok(info.bytes_records <= Buffer.byteLength(input));
        next();
      });
    });
  }
});
