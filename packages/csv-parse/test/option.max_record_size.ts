import "should";
import dedent from "dedent";
import { parse } from "../lib/index.js";
import { assert_error } from "./api.assert_error.js";

describe("Option `max_record_size`", function () {
  it("validation", function () {
    parse("", { max_record_size: 10 }, () => {});
    parse("", { max_record_size: "10" }, () => {});
    (() => {
      parse("", { max_record_size: -1 }, () => {});
    }).should.throw(
      "Invalid Option: max_record_size must be a positive integer, got -1",
    );
    (() => {
      parse("", { max_record_size: "oh no" }, () => {});
    }).should.throw(
      'Invalid Option: max_record_size must be a positive integer, got "oh no"',
    );
  });

  it("field exceed limit", function (next) {
    parse(
      dedent`
        12,34,56
        ab,cd,ef
        hi,xxxxxxxxxxxxxxx,jk
        lm,no,pq
      `,
      { max_record_size: 10 },
      (err) => {
        if (!err) return Error("Invalid assertion");
        assert_error(err, {
          message:
            "Max Record Size: record exceed the maximum number of tolerated bytes of 10 at line 3",
          code: "CSV_MAX_RECORD_SIZE",
          column: 1,
          empty_lines: 0,
          header: false,
          index: 1,
          invalid_field_length: 0,
          quoting: false,
          lines: 3,
          records: 2,
        });
        next();
      },
    );
  });
});
