import "should";
import dedent from "dedent";
import { parse } from "../lib/index.js";

describe("Option `from_line`", function () {
  it("validation", function () {
    parse("", { from_line: 10 }, () => {});
    parse("", { from_line: "10" }, () => {});
    parse("", { from_line: null }, () => {});
    parse("", { from_line: undefined }, () => {});
    (() => {
      parse("", { from_line: -1 }, () => {});
    }).should.throw(
      "Invalid Option: from_line must be a positive integer greater than 0, got -1",
    );
    (() => {
      parse("", { from_line: 0 }, () => {});
    }).should.throw(
      "Invalid Option: from_line must be a positive integer greater than 0, got 0",
    );
    (() => {
      parse("", { from_line: "0" }, () => {});
    }).should.throw(
      'Invalid Option: from_line must be a positive integer greater than 0, got "0"',
    );
    (() => {
      parse("", { from_line: "oh no" }, () => {});
    }).should.throw(
      'Invalid Option: from_line must be an integer, got "oh no"',
    );
  });

  it("start at defined position", function (next) {
    parse(
      dedent`
        1,2,3
        4,5,6
        7,8,9
      `,
      { from_line: 3 },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([["7", "8", "9"]]);
        next();
      },
    );
  });

  it("handle lines with inconsistent number of fields", function (next) {
    parse(
      dedent`
        a
        1,2,3
      `,
      { from_line: 2 },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([["1", "2", "3"]]);
        next();
      },
    );
  });

  it("records with quoted line at the beginning of line", function (next) {
    parse(
      dedent`1,2,"

        3"
        4,5,"
        6"
        7,8,"
        9"
      `,
      { from_line: 4 },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["4", "5", "\n6"],
          ["7", "8", "\n9"],
        ]);
        next();
      },
    );
  });

  it("records with quoted line in the middle of line", function (next) {
    parse(
      dedent`
        1,2,"

        3"
        4,5,"
        6"
        7,8,"
        9"
      `,
      { from_line: 2 },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["4", "5", "\n6"],
          ["7", "8", "\n9"],
        ]);
        next();
      },
    );
  });

  it("not influenced by `record_delimiter` option", function (next) {
    parse(
      dedent`
        a,b,c:1,2,
        3:d,e,f:4,5,
        6:g,h,i:7,8,
        9
      `,
      { from_line: 3, record_delimiter: ":" },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["g", "h", "i"],
          ["7", "8", "\n9"],
        ]);
        next();
      },
    );
  });

  it("no influenced by skip_empty_lines option", function (next) {
    parse(
      dedent`
        a,b,c

        1,2,3

        4,5,6

        7,8,9
      `,
      { from_line: 5, skip_empty_lines: true },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["4", "5", "6"],
          ["7", "8", "9"],
        ]);
        next();
      },
    );
  });

  it("handle multiple bytes record delimiters", function (next) {
    parse(`a,b\r\nc,d\r\ne,f`, { from_line: 2 }, (err, records) => {
      if (err) return next(err);
      records.should.eql([
        ["c", "d"],
        ["e", "f"],
      ]);
      next();
    });
  });

  it("honors header", function (next) {
    parse(
      dedent`
        x,y,z
        x,y,z
        a,b,c
        4,5,6
      `,
      { from_line: 3, columns: true },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([{ a: "4", b: "5", c: "6" }]);
        next();
      },
    );
  });
});
