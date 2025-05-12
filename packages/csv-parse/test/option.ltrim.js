import "should";
import dedent from "dedent";
import { parse } from "../lib/index.js";
import { assert_error } from "./api.assert_error.js";

describe("Option `ltrim`", function () {
  it("validation", function () {
    parse("", { ltrim: true }, () => {});
    parse("", { ltrim: false }, () => {});
    parse("", { ltrim: null }, () => {});
    parse("", { ltrim: undefined }, () => {});
    (() => {
      parse("", { ltrim: 1 }, () => {});
    }).should.throw("Invalid Option: ltrim must be a boolean, got 1");
    (() => {
      parse("", { ltrim: "true" }, () => {});
    }).should.throw('Invalid Option: ltrim must be a boolean, got "true"');
  });

  it("plain text", function (next) {
    parse(
      ` a b, c d\n e f, g h`,
      { quote: "'", escape: "'", trim: true },
      (err, records) => {
        if (!err) {
          records.should.eql([
            ["a b", "c d"],
            ["e f", "g h"],
          ]);
        }
        next(err);
      },
    );
  });

  it("before quote", function (next) {
    const data = ` 'a', 'b'\n 'c', 'd'`;
    const parser = parse(
      { quote: "'", escape: "'", trim: true },
      (err, records) => {
        if (!err) {
          records.should.eql([
            ["a", "b"],
            ["c", "d"],
          ]);
        }
        next(err);
      },
    );
    for (const chr of data) {
      parser.write(chr);
    }
    parser.end();
  });

  it("quote followed by escape", function (next) {
    // 1st line: with start of file
    // 2nd line: with field delimiter
    // 3rd line: with record delimiter
    parse(
      dedent`
        '''a','''b'
        '''c', '''d'
        '''e','''f'
      `,
      { quote: "'", escape: "'", trim: true },
      (err, records) => {
        if (!err) {
          records.should.eql([
            ["'a", "'b"],
            ["'c", "'d"],
            ["'e", "'f"],
          ]);
        }
        next(err);
      },
    );
  });

  it("with whitespaces around quotes", function (next) {
    const data = `   " a b", "   c d"\n " e f",   "   g h"`;
    const parser = parse({ ltrim: true }, (err, records) => {
      if (!err) {
        records.should.eql([
          [" a b", "   c d"],
          [" e f", "   g h"],
        ]);
      }
      next(err);
    });
    for (const chr of data) {
      parser.write(chr);
    }
    parser.end();
  });

  it("with char after whitespaces", function (next) {
    const data = ` x  " a b",x "   c d"\nx " e f", x  "   g h"`;
    const parser = parse({ ltrim: true }, (err) => {
      assert_error(err, {
        message:
          'Invalid Opening Quote: a quote is found on field 0 at line 1, value is "x  "',
        code: "INVALID_OPENING_QUOTE",
        field: "x  ",
      });
      next();
    });
    for (const chr of data) {
      parser.write(chr);
    }
    parser.end();
  });

  it("should work on last field", function (next) {
    const records = [];
    const parser = parse({ ltrim: true });
    parser.on("readable", () => {
      let d;
      while ((d = parser.read())) {
        records.push(d);
      }
    });
    parser.on("end", () => {
      records.should.eql([
        ["FIELD_1", "FIELD_2"],
        ["20322051544", "a"],
        ["28392898392", " "],
      ]);
      next();
    });
    parser.write(dedent`
      FIELD_1, FIELD_2
      20322051544, a
      28392898392, " "
    `);
    parser.end();
  });
});
