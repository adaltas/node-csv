import "should";
import dedent from "dedent";
import { parse } from "../lib/index.js";
import { assert_error } from "./api.assert_error.js";
import { CsvError } from "../dist/cjs/index.cjs";

describe("Option `skip_records_with_error`", function () {
  it("validation", function () {
    parse("", { skip_records_with_error: true }, () => {});
    parse("", { skip_records_with_error: false }, () => {});
    parse("", { skip_records_with_error: null }, () => {});
    parse("", { skip_records_with_error: undefined }, () => {});
  });

  it('handle "Invalid closing quote"', function (next) {
    let errors = 0;
    const parser = parse({ skip_records_with_error: true }, (err, records) => {
      if (err) return next(err);
      records.should.eql([
        ["a", "b", "c"],
        ["one", "two", "three"],
        ["seven", "eight", "nine"],
      ]);
      errors.should.eql(1);
      next();
    });
    parser.on("skip", (err) => {
      assert_error(err, {
        message:
          'Invalid Closing Quote: got " " at line 3 instead of delimiter, record delimiter, trimable character (if activated) or comment',
        code: "CSV_INVALID_CLOSING_QUOTE",
      });
      errors++;
    });
    parser.write(
      dedent`
        "a","b","c"
        "one","two","three"
        "four"," " ","six"
        "seven","eight","nine"
      `,
    );
    parser.end();
  });

  it('handle "Invalid opening quote"', function (next) {
    const errors: CsvError[] = [];
    const parser = parse({ skip_records_with_error: true }, (err, records) => {
      if (err) return next(err);
      records.should.eql([
        ["line", "1"],
        ["line", "3"],
      ]);
      assert_error(errors, [
        {
          message:
            'Invalid Opening Quote: a quote is found on field 1 at line 2, value is "invalid h"',
          code: "INVALID_OPENING_QUOTE",
          field: "invalid h",
        },
        {
          message:
            'Invalid Opening Quote: a quote is found on field 1 at line 2, value is "invalid h\\"ere"',
          code: "INVALID_OPENING_QUOTE",
          field: 'invalid h"ere',
        },
      ]);
      errors.length.should.eql(2);
      next();
    });
    parser.on("skip", (err) => {
      errors.push(err);
    });
    parser.write(dedent`
      "line",1
      "line",invalid h"ere"
      line,3
    `);
    parser.end();
  });

  it('handle "Quoted field not terminated"', function (next) {
    let errors = 0;
    const parser = parse({ skip_records_with_error: true }, (err, records) => {
      if (err) return next(err);
      records.should.eql([["a", "b", "c", "d"]]);
      errors.should.eql(1);
      next();
    });
    parser.on("skip", (err) => {
      assert_error(err, {
        message:
          "Quote Not Closed: the parsing is finished with an opening quote at line 2",
        code: "CSV_QUOTE_NOT_CLOSED",
      });
      errors++;
    });
    parser.write(dedent`
      "a",b,"c",d
      "",1974,8.8392926E7,"","
    `);
    parser.end();
  });

  it('handle "CSV_RECORD_INCONSISTENT_COLUMNS"', function (next) {
    let errors = 0;
    const parser = parse(
      { skip_records_with_error: true, columns: ["a", "b", "c", "d"] },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([
          { a: "4", b: "5", c: "6", d: "x" },
          { a: "7", b: "8", c: "9", d: "y" },
        ]);
        errors.should.eql(1);
        next();
      },
    );
    parser.on("skip", (err) => {
      assert_error(err, {
        message: "Invalid Record Length: columns length is 4, got 3 on line 1",
        code: "CSV_RECORD_INCONSISTENT_COLUMNS",
        record: ["1", "2", "3"],
      });
      errors++;
    });
    parser.write(dedent`
      1,2,3
      4,5,6,x
      7,8,9,y
    `);
    parser.end();
  });

  it('handle "CSV_RECORD_INCONSISTENT_FIELDS_LENGTH"', function (next) {
    let errors = 0;
    const parser = parse({ skip_records_with_error: true }, (err, records) => {
      if (err) return next(err);
      records.should.eql([
        ["a", "b", "c", "d"],
        ["e", "f", "g", "h"],
      ]);
      errors.should.eql(1);
      next();
    });
    parser.on("skip", (err) => {
      assert_error(err, {
        message: "Invalid Record Length: expect 4, got 3 on line 2",
        code: "CSV_RECORD_INCONSISTENT_FIELDS_LENGTH",
        record: ["1", "2", "3"],
      });
      errors++;
    });
    parser.write(dedent`
      a,b,c,d
      1,2,3
      e,f,g,h
    `);
    parser.end();
  });

  describe("with `bom` option", function () {
    it('handle "CSV_RECORD_INCONSISTENT_FIELDS_LENGTH" with bom (fix #411)', function (next) {
      let errors = 0;
      const parser = parse(
        { bom: true, skip_records_with_error: true },
        (err, records) => {
          if (err) return next(err);
          records.should.eql([
            ["a", "b", "c", "d"],
            ["e", "f", "g", "h"],
          ]);
          errors.should.eql(1);
          next();
        },
      );
      parser.on("skip", (err) => {
        assert_error(err, {
          message: "Invalid Record Length: expect 4, got 3 on line 2",
          code: "CSV_RECORD_INCONSISTENT_FIELDS_LENGTH",
          record: ["1", "2", "3"],
        });
        errors++;
      });
      parser.write("\ufeffa,b,c,d\n1,2,3\ne,f,g,h");
      parser.end();
    });
  });

  describe("with `raw` option", function () {
    it("print raw record", function (next) {
      let errors = 0;
      const parser = parse(
        dedent`
          "a","b","c"
          "one","two","three"
          "four"," " ","six"
          "seven","eight","nine"
        `,
        {
          skip_records_with_error: true,
          raw: true,
        },
        (err) => {
          if (err) return next(err);
          errors.should.eql(1);
          next();
        },
      );
      parser.on("skip", (err, raw) => {
        err.raw.should.eql('"four"," "');
        raw.should.eql('"four"," "');
        errors++;
      });
    });
  });
});
