import "should";
import dedent from "dedent";
import { parse } from "../lib/index.js";

describe("Option `ignore_last_delimiters`", function () {
  describe("validation & normalization", function () {
    it("default to `false`", function () {
      parse().options.ignore_last_delimiters.should.eql(false);
    });

    it("boolean", function () {
      parse({
        ignore_last_delimiters: true,
        columns: true,
      }).options.ignore_last_delimiters.should.eql(true);
      parse({
        ignore_last_delimiters: false,
        columns: true,
      }).options.ignore_last_delimiters.should.eql(false);
    });

    it("integer", function () {
      parse({
        ignore_last_delimiters: 1,
      }).options.ignore_last_delimiters.should.eql(1);
      parse({
        ignore_last_delimiters: 0,
      }).options.ignore_last_delimiters.should.eql(false);
    });

    it("throw error with invalid type", function () {
      (() => {
        parse({ ignore_last_delimiters: "invalid" });
      }).should.throw({
        code: "CSV_INVALID_OPTION_IGNORE_LAST_DELIMITERS",
        message: [
          "Invalid option `ignore_last_delimiters`:",
          "the value must be a boolean value or an integer,",
          'got "invalid"',
        ].join(" "),
      });
    });

    it("requires columns", function () {
      (() => {
        parse({ ignore_last_delimiters: true });
      }).should.throw({
        code: "CSV_IGNORE_LAST_DELIMITERS_REQUIRES_COLUMNS",
        message: [
          "The option `ignore_last_delimiters`",
          "requires the activation of the `columns` option",
        ].join(" "),
      });
    });
  });

  describe("usage", function () {
    it("if true, get field number from columns", function (next) {
      parse(
        dedent`
          a,b,c
          1,2,3,4,5
          11,22,33,44
        `,
        { ignore_last_delimiters: true, columns: true },
        (err, records) => {
          if (!err) {
            records.should.eql([
              { a: "1", b: "2", c: "3,4,5" },
              { a: "11", b: "22", c: "33,44" },
            ]);
          }
          next(err);
        },
      );
    });

    it("if number, no need for columns", function (next) {
      parse(
        dedent`
          1,2,3,4,5
          11,22,33,44
        `,
        { ignore_last_delimiters: 3 },
        (err, records) => {
          if (!err) {
            records.should.eql([
              ["1", "2", "3,4,5"],
              ["11", "22", "33,44"],
            ]);
          }
          next(err);
        },
      );
    });
  });
});
