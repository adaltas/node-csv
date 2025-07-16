import "should";
import dedent from "dedent";
import { parse } from "../lib/index.js";

describe("Option `to_line`", function () {
  it("validation", function () {
    parse("", { to_line: 10 }, () => {});
    parse("", { to_line: "10" }, () => {});
    parse("", { to_line: null }, () => {});
    parse("", { to_line: undefined }, () => {});
    (() => {
      parse("", { to_line: -2 }, () => {});
    }).should.throw(
      "Invalid Option: to_line must be a positive integer greater than 0, got -2",
    );
    (() => {
      parse("", { to_line: 0 }, () => {});
    }).should.throw(
      "Invalid Option: to_line must be a positive integer greater than 0, got 0",
    );
  });

  it("start at defined position", function (next) {
    parse(
      dedent`
        1,2,3
        4,5,6
        7,8,9
      `,
      { to_line: 2 },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["1", "2", "3"],
          ["4", "5", "6"],
        ]);
        next();
      },
    );
  });

  it("count headers", function (next) {
    parse(
      dedent`
        a,b,c
        1,2,3
        4,5,6
        7,8,9
      `,
      { columns: true, to_line: 3 },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([
          { a: "1", b: "2", c: "3" },
          { a: "4", b: "5", c: "6" },
        ]);
        next();
      },
    );
  });

  it("records with quoted line at the end of line", function (next) {
    parse(
      dedent`
        1,2,"

        3"
        4,5,"
        6"
        7,8,"
        9"
      `,
      { to_line: 5 },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["1", "2", "\n\n3"],
          ["4", "5", "\n6"],
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
      { to_line: 6 },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["1", "2", "\n\n3"],
          ["4", "5", "\n6"],
        ]);
        next();
      },
    );
  });

  it("not influenced by record delimiter", function (next) {
    parse(
      dedent`
        a,b,c:1,2,
        3:d,e,f:4,5,
        6:g,h,i:7,8,
        9
      `,
      { to_line: 2, record_delimiter: ":" },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["a", "b", "c"],
          ["1", "2", "\n3"],
          ["d", "e", "f"],
        ]);
        next();
      },
    );
  });
});
