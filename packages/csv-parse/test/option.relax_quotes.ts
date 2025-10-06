import "should";
import dedent from "dedent";
import { parse } from "../lib/index.js";
import { assert_error } from "./api.assert_error.js";

describe("Option `relax_quotes`", function () {
  it("validation", function () {
    parse("", { relax_quotes: true }, () => {});
    parse("", { relax_quotes: false }, () => {});
    parse("", { relax_quotes: null }, () => {});
    parse("", { relax_quotes: undefined }, () => {});
  });

  it("true with invalid quotes in the middle", function (next) {
    parse(
      `384682,the "SAMAY" Hostel,Jiron Florida 285`,
      { relax_quotes: true },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["384682", 'the "SAMAY" Hostel', "Jiron Florida 285"],
        ]);
        next();
      },
    );
  });

  it("false with invalid quotes in the middle", function (next) {
    parse(
      `384682,the "SAMAY" Hostel,Jiron Florida 285`,
      { relax_quotes: false },
      (err) => {
        if (!err) return next(Error("Invalid assessment"));
        assert_error(err, {
          message:
            'Invalid Opening Quote: a quote is found on field 1 at line 1, value is "the "',
          code: "INVALID_OPENING_QUOTE",
          field: "the ",
        });
        next();
      },
    );
  });

  it("true with invalid quotes on the left", function (next) {
    parse(
      dedent`
        a,"b" c,d
        a,""b" c,d
      `,
      { relax_quotes: true },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["a", '"b" c', "d"],
          ["a", '""b" c', "d"],
        ]);
        next();
      },
    );
  });

  it("false with invalid quotes on the left", function (next) {
    parse(`a,"b" c,d`, { relax_quotes: false }, (err) => {
      if (!err) return next(Error("Invalid assessment"));
      assert_error(err, {
        message:
          'Invalid Closing Quote: got " " at line 1 instead of delimiter, record delimiter, trimable character (if activated) or comment',
        code: "CSV_INVALID_CLOSING_QUOTE",
      });
      next();
    });
  });

  it("true with two invalid quotes on the left", function (next) {
    parse(`a,""b"" c,d`, { relax_quotes: true }, (err, records) => {
      if (err) return next(err);
      records.should.eql([["a", '""b"" c', "d"]]);
      next();
    });
  });

  it("false with two invalid quotes on the left", function (next) {
    parse(`a,""b"" c,d`, { relax_quotes: false }, (err) => {
      if (!err) return next(Error("Invalid assessment"));
      assert_error(err, {
        message:
          'Invalid Closing Quote: got "b" at line 1 instead of delimiter, record delimiter, trimable character (if activated) or comment',
        code: "CSV_INVALID_CLOSING_QUOTE",
      });
      next();
    });
  });

  it("true with invalid quotes on the right", function (next) {
    parse(
      `a,b "c",d
Bob"","23",e`,
      { relax_quotes: true },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["a", 'b "c"', "d"],
          ['Bob""', "23", "e"],
        ]);
        next();
      },
    );
  });

  it("false with invalid quotes on the right", function (next) {
    parse(`a,b "c"`, { relax_quotes: false }, (err) => {
      if (!err) return next(Error("Invalid assessment"));
      assert_error(err, {
        message:
          'Invalid Opening Quote: a quote is found on field 1 at line 1, value is "b "',
        code: "INVALID_OPENING_QUOTE",
        field: "b ",
      });
      next();
    });
  });
});
