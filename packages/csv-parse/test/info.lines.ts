import "should";
import dedent from "dedent";
import { parse } from "../lib/index.js";
import { assert_error } from "./api.assert_error.js";

describe("info lines", function () {
  it("count lines", function (next) {
    const p = parse("a,b,c\nd,e,f\nh,i,j", (err) => {
      if (err) return next(err);
      p.info.lines.should.eql(3);
      next();
    });
  });

  it("count no line", function (next) {
    const p = parse("", (err) => {
      if (err) return next(err);
      p.info.lines.should.eql(1);
      next();
    });
  });

  it("count empty lines", function (next) {
    const p = parse("\n\n", (err) => {
      if (err) return next(err);
      p.info.lines.should.eql(3);
      next();
    });
  });

  it("should count sparse empty lines", function (next) {
    const p = parse(
      "\na,b,c\n\nd,e,f\nh,i,j\n",
      {
        skip_empty_lines: true,
      },
      (err) => {
        if (err) return next(err);
        p.info.lines.should.eql(6);
        next();
      },
    );
  });

  it("should display correct line number when invalid opening quotes", function (next) {
    parse(
      dedent`
        "this","line","is",valid
        "this","line",is,"also,valid"
        this,"line",is,"invalid",h"ere"
        "and",valid,line,follows...
      `,
      (err, records) => {
        if (!err) return next(Error("Invalid assessment"));
        assert_error(err, {
          message:
            'Invalid Opening Quote: a quote is found on field 4 at line 3, value is "h"',
          code: "INVALID_OPENING_QUOTE",
          field: "h",
        });
        (records == undefined).should.be.true();
        next();
      },
    );
  });

  it('should count empty lines with "skip_empty_lines" true', function (next) {
    parse(
      dedent`
        "this","line","is",valid

        "this","line",is,"also,valid"
        this,"line",is,invalid h"ere"
        "and",valid,line,follows...
      `,
      {
        skip_empty_lines: true,
      },
      (err, records) => {
        if (!err) return next(Error("Invalid assessment"));
        assert_error(err, {
          message:
            'Invalid Opening Quote: a quote is found on field 3 at line 4, value is "invalid h"',
          code: "INVALID_OPENING_QUOTE",
          field: "invalid h",
        });
        (records == undefined).should.be.true();
        next();
      },
    );
  });

  it("should display correct line number when unclosed quotes", function (next) {
    parse(
      dedent`
        "",1974,8.8392926E7,"",""
        "",1974,8.8392926E7,"",""
        "",1974,8.8392926E7,"",""
        "",1974,8.8392926E7,"","
        "",1974,8.8392926E7,"",""
      `,
      (err, records) => {
        if (!err) return next(Error("Invalid assessment"));
        assert_error(err, {
          message:
            "Quote Not Closed: the parsing is finished with an opening quote at line 5",
          code: "CSV_QUOTE_NOT_CLOSED",
        });
        (records == undefined).should.be.true();
        next();
      },
    );
  });

  it("should display correct line number when invalid quotes", function (next) {
    parse(
      dedent`
        "  1974    8.8392926E7 ""t "
        "  1974    8.8392926E7 ""t "
        ""  1974    8.8392926E7 ""t ""
        "  1974    8.8392926E7 ""t "
        "  1974    8.8392926E7 "t ""
      `,
      {
        quote: '"',
        escape: '"',
        delimiter: "\t",
      },
      (err, records) => {
        if (!err) return next(Error("Invalid assessment"));
        assert_error(err, {
          message:
            'Invalid Closing Quote: got " " at line 3 instead of delimiter, record delimiter, trimable character (if activated) or comment',
          code: "CSV_INVALID_CLOSING_QUOTE",
        });
        (records == undefined).should.be.true();
        next();
      },
    );
  });

  it("should display correct line number when invalid quotes from string", function (next) {
    parse(
      dedent`
        "",1974,8.8392926E7,"",""
        "",1974,8.8392926E7,""t,""
        "",1974,8.8392926E7,""t,""
        "",1974,8.8392926E7,"",""
        "",1974,8.8392926E7,"",""
        "",1974,8.8392926E7,""t,""
      `,
      {
        quote: '"',
        escape: '"',
      },
      (err, records) => {
        if (!err) return next(Error("Invalid assessment"));
        assert_error(err, {
          message:
            'Invalid Closing Quote: got "t" at line 2 instead of delimiter, record delimiter, trimable character (if activated) or comment',
          code: "CSV_INVALID_CLOSING_QUOTE",
        });
        (records == undefined).should.be.true();
        next();
      },
    );
  });
});
