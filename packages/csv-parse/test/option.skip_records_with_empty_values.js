import "should";
import { parse } from "../lib/index.js";
import { parse as parseSync } from "../lib/sync.js";

describe("Option `skip_records_with_empty_values`", function () {
  it("validation", function () {
    (() => {
      parse("", { skip_records_with_empty_values: 1 }, () => {});
    }).should.throw(
      "Invalid Option: skip_records_with_empty_values must be a boolean, got 1",
    );
    (() => {
      parse("", { skip_records_with_empty_values: "oh no" }, () => {});
    }).should.throw(
      'Invalid Option: skip_records_with_empty_values must be a boolean, got "oh no"',
    );
  });

  describe("with `skip_records_with_error`", function () {
    for (const columns of [false, true, ["a", "b"]]) {
      for (const empty of ["", ",,"]) {
        const input = `a,b\n${empty}\nc,d\ne,f`;
        const expected =
          columns === false
            ? [
                ["a", "b"],
                ["c", "d"],
                ["e", "f"],
              ]
            : columns === true
              ? [
                  { a: "c", b: "d" },
                  { a: "e", b: "f" },
                ]
              : [
                  { a: "a", b: "b" },
                  { a: "c", b: "d" },
                  { a: "e", b: "f" },
                ];
        const code =
          columns === false
            ? "CSV_RECORD_INCONSISTENT_FIELDS_LENGTH"
            : "CSV_RECORD_INCONSISTENT_COLUMNS";
        const title = `columns ${JSON.stringify(columns)}, empty row ${JSON.stringify(empty)}`;

        it(`preserves the next record in sync mode: ${title}`, function () {
          const errors = [];
          const records = parseSync(input, {
            columns,
            skip_records_with_empty_values: true,
            skip_records_with_error: true,
            on_skip: (err) => errors.push(err.code),
          });
          records.should.eql(expected);
          errors.should.eql([code]);
        });

        it(`preserves the next record across one-byte writes: ${title}`, function (next) {
          const errors = [];
          const parser = parse(
            {
              columns,
              skip_records_with_empty_values: true,
              skip_records_with_error: true,
              on_skip: (err) => errors.push(err.code),
            },
            (err, records) => {
              if (err) return next(err);
              records.should.eql(expected);
              errors.should.eql([code]);
              next();
            },
          );
          for (const byte of Buffer.from(input)) {
            parser.write(Buffer.from([byte]));
          }
          parser.end();
        });
      }
    }
  });
});
