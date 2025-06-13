import "should";
import dedent from "dedent";
import { parse } from "../lib/index.js";
import { assert_error } from "./api.assert_error.js";

describe("Option `on_skip`", function () {
  it("validation", function () {
    parse("", { on_skip: () => {} }, () => {});
  });

  it("catch thrown error", function (next) {
    parse(
      dedent`
          a,b,c,d
          invalid
          e,f,g,h
        `,
      {
        bom: true,
        skip_records_with_error: true,
        on_skip: () => {
          throw Error("Catchme");
        },
      },
      (err) => {
        if (!err) return next(new Error("Invalid assessment"));
        err.message.should.eql("Catchme");
        next();
      },
    );
  });

  it('handle "CSV_RECORD_INCONSISTENT_FIELDS_LENGTH" with bom (fix #411)', function (next) {
    let errors = 0;
    const parser = parse(
      {
        bom: true,
        skip_records_with_error: true,
        on_skip: (err) => {
          if (!err) throw Error("Invalid assessment");
          assert_error(err, {
            message: "Invalid Record Length: expect 4, got 3 on line 2",
            code: "CSV_RECORD_INCONSISTENT_FIELDS_LENGTH",
            record: ["1", "2", "3"],
          });
          errors++;
        },
      },
      (err, records) => {
        if (!err) {
          records.should.eql([
            ["a", "b", "c", "d"],
            ["e", "f", "g", "h"],
          ]);
        }
        errors.should.eql(1);
        next(err);
      },
    );
    parser.write(
      dedent`
        a,b,c,d
        1,2,3
        e,f,g,h
      `,
    );
    parser.end();
  });
});
