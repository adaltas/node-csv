import assert from "node:assert/strict";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { stringify, CastingContext } from "../lib/index.js";
import { stringify as stringifySync } from "../lib/sync.js";

describe("Option `columns.cast`", function () {
  it("formats dates and numbers separately by column", function () {
    const date = new Date("2026-01-02T03:04:05.000Z");
    const row = { date, datetime: date, count: 12, amount: 12 };
    const output = stringifySync([row], {
      header: true,
      columns: [
        {
          key: "date",
          header: "Date",
          cast: (value) => {
            assert(value instanceof Date);
            return value.toISOString().slice(0, 10);
          },
        },
        {
          key: "datetime",
          header: "Date Time",
          cast: (value) => {
            assert(value instanceof Date);
            return value.toISOString();
          },
        },
        { key: "count", header: "Count" },
        {
          key: "amount",
          header: "Amount",
          cast: (value) => {
            assert(typeof value === "number");
            return value.toFixed(2);
          },
        },
      ],
    });
    assert.equal(
      output,
      "Date,Date Time,Count,Amount\n2026-01-02,2026-01-02T03:04:05.000Z,12,12.00\n",
    );
    assert.deepEqual(row, { date, datetime: date, count: 12, amount: 12 });
  });

  it("uses array positions and preserves global casts for other fields and headers", function () {
    const contexts: CastingContext[] = [];
    const output = stringifySync(
      [
        [2, 3],
        [4, 5],
      ],
      {
        header: true,
        columns: [
          {
            key: "amount",
            cast: (value, context) => {
              contexts.push(context);
              return `$${value}`;
            },
          },
          "count",
        ],
        cast: {
          number: (value) => `N${value}`,
          string: (value) => value.toUpperCase(),
        },
      },
    );
    assert.equal(output, "AMOUNT,COUNT\n$2,N3\n$4,N5\n");
    assert.deepEqual(contexts, [
      { index: 0, column: 0, records: 0, header: false },
      { index: 0, column: 0, records: 1, header: false },
    ]);
  });

  it("receives nested object values and their column context", function () {
    const contexts: CastingContext[] = [];
    const output = stringifySync([{ nested: { amount: 4 }, count: 3 }], {
      columns: [
        "count",
        {
          key: "nested.amount",
          cast: (value, context) => {
            contexts.push(context);
            return `$${value}`;
          },
        },
      ],
    });
    assert.equal(output, "3,$4\n");
    assert.deepEqual(contexts, [
      { index: 1, column: "nested.amount", records: 0, header: false },
    ]);
  });

  it("formats null and missing fields in the callback API", function (next) {
    stringify(
      [{ a: null, b: undefined }],
      {
        columns: ["a", "b", "c"].map((key) => ({
          key,
          cast: (value) => (value === null ? "NULL" : "MISSING"),
        })),
      },
      (err, output) => {
        if (err) return next(err);
        assert.equal(output, "NULL,MISSING,MISSING\n");
        next();
      },
    );
  });

  it("uses the existing field-level options and quoting rules", function () {
    const result = Object.freeze({ value: 'one,"two"\nthree', quoted: true });
    const output = stringifySync([{ a: 1 }, { a: 2 }], {
      columns: [{ key: "a", cast: () => result }],
    });
    assert.equal(output, '"one,""two""\nthree"\n"one,""two""\nthree"\n');
    assert.deepEqual(result, { value: 'one,"two"\nthree', quoted: true });
  });

  it("supports empty cast values", function () {
    assert.equal(
      stringifySync([{ a: 1, b: 2 }], {
        columns: [
          { key: "a", cast: () => null },
          { key: "b", cast: () => ({ value: undefined }) },
        ],
      }),
      ",\n",
    );
  });

  it("does not call data formatters for header-only output", function () {
    assert.equal(
      stringifySync([], {
        header: true,
        eof: false,
        columns: [
          {
            key: "amount",
            cast: () => {
              throw Error("Data formatter called for a header");
            },
          },
        ],
        cast: { string: (value) => value.toUpperCase() },
      }),
      "AMOUNT",
    );
  });

  it("propagates formatter errors in the sync API", function () {
    const error = Error("Column formatting failed");
    assert.throws(
      () =>
        stringifySync([{ a: 1 }], {
          columns: [
            {
              key: "a",
              cast: () => {
                throw error;
              },
            },
          ],
        }),
      error,
    );
  });

  it("propagates formatter errors in the callback API", function (next) {
    const error = Error("Column formatting failed");
    stringify(
      [{ a: 1 }],
      {
        columns: [
          {
            key: "a",
            cast: () => {
              throw error;
            },
          },
        ],
      },
      (err) => {
        assert.equal(err, error);
        next();
      },
    );
  });

  it("formats records through a stream pipeline", async function () {
    let output = "";
    await pipeline(
      Readable.from([{ amount: 2, count: 3 }]),
      stringify({
        columns: [{ key: "amount", cast: (value) => `$${value}` }, "count"],
      }),
      async (source) => {
        for await (const chunk of source) output += chunk;
      },
    );
    assert.equal(output, "$2,3\n");
  });
});
