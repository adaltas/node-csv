import "should";
import dedent from "dedent";
import { parse } from "../lib/index.js";

describe("Option `skip_records_with_empty_values`", function () {
  it("validation", function () {
    parse("", { skip_records_with_empty_values: true }, () => {});
    parse("", { skip_records_with_empty_values: false }, () => {});
    parse("", { skip_records_with_empty_values: null }, () => {});
    parse("", { skip_records_with_empty_values: undefined }, () => {});
  });

  it("dont skip by default", function (next) {
    parse("ABC,DEF\n,\nIJK,LMN", (err, records) => {
      if (err) return next(err);
      records.should.eql([
        ["ABC", "DEF"],
        ["", ""],
        ["IJK", "LMN"],
      ]);
      next();
    });
  });

  it("skip", function (next) {
    parse(
      dedent`
        ABC,DEF
        ,
        IJK,LMN
        ,
      `,
      { skip_records_with_empty_values: true },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["ABC", "DEF"],
          ["IJK", "LMN"],
        ]);
        next();
      },
    );
  });

  it("skip space and tabs", function (next) {
    parse(
      "ABC,DEF\n\t , \t\nIJK,LMN\n\t , \t\n",
      { skip_records_with_empty_values: true },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["ABC", "DEF"],
          ["IJK", "LMN"],
        ]);
        next();
      },
    );
  });

  it("handle value which are casted to another type than string", function (next) {
    parse(
      dedent`
        empty_buffer
        boolean
        integer
        null
        undefined
      `,
      {
        skip_records_with_empty_values: true,
        cast: (value) => {
          switch (value) {
            case "empty_buffer":
              return Buffer.from("");
            case "boolean":
              return true;
            case "integer":
              return 0;
            case "null":
              return null;
            case "undefined":
              return undefined;
            default:
              return value;
          }
        },
      },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([[true], [0]]);
        next();
      },
    );
  });
});
