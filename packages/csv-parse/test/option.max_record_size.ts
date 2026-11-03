import "should";
import dedent from "dedent";
import { parse } from "../lib/index.js";
import { parse as parseSync } from "../lib/sync.js";
import { assert_error } from "./api.assert_error.js";

describe("Option `max_record_size`", function () {
  it("counts numeric fields before casting", function () {
    (() => {
      parseSync("1,2,3,4,5", { max_record_size: 3, cast: true });
    }).should.throw({ code: "CSV_MAX_RECORD_SIZE" });
  });

  it("counts fields cast to null", function () {
    (() => {
      parseSync("1,2,3,4,5", { max_record_size: 3, cast: () => null });
    }).should.throw({ code: "CSV_MAX_RECORD_SIZE" });
  });

  it("counts fields without string decoding", function () {
    (() => {
      parseSync("1,2,3,4,5", { max_record_size: 3, encoding: null });
    }).should.throw({ code: "CSV_MAX_RECORD_SIZE" });
  });

  it("counts input fields when a cast shortens them", function () {
    (() => {
      parseSync("abc,abc,abc", {
        max_record_size: 7,
        cast: (value) => value[0],
      });
    }).should.throw({ code: "CSV_MAX_RECORD_SIZE" });
  });

  it("allows casts to expand fields within the input limit", function () {
    parseSync("a,b", {
      max_record_size: 3,
      cast: (value) => value.repeat(10),
    }).should.eql([["aaaaaaaaaa", "bbbbbbbbbb"]]);
  });

  it("preserves accounting across streamed chunks with casting", function (next) {
    const parser = parse({ max_record_size: 3, cast: true }, (err) => {
      if (!err) return next(Error("Invalid assertion"));
      assert_error(err, { code: "CSV_MAX_RECORD_SIZE" });
      next();
    });
    parser.write("1,2,");
    parser.end("3,4,5");
  });

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
        if (!err) return next(Error("Invalid assertion"));
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
