import "should";
import dedent from "dedent";
import { parse } from "../lib/index.js";

describe("Option `to`", function () {
  it("validation", function () {
    parse("", { to: 10 }, () => {});
    parse("", { to: "10" }, () => {});
    (() => {
      parse("", { to: -1 }, () => {});
    }).should.throw(
      "Invalid Option: to must be a positive integer greater than 0, got -1",
    );
    (() => {
      parse("", { to: 0 }, () => {});
    }).should.throw(
      "Invalid Option: to must be a positive integer greater than 0, got 0",
    );
    (() => {
      parse("", { to: "0" }, () => {});
    }).should.throw(
      'Invalid Option: to must be a positive integer greater than 0, got "0"',
    );
    (() => {
      parse("", { to: true }, () => {});
    }).should.throw("Invalid Option: to must be an integer, got true");
    (() => {
      parse("", { to: false }, () => {});
    }).should.throw("Invalid Option: to must be an integer, got false");
    (() => {
      parse("", { to: "oh no" }, () => {});
    }).should.throw('Invalid Option: to must be an integer, got "oh no"');
  });

  it("start at defined position", function (next) {
    parse(
      dedent`
      1,2,3
      4,5,6
      7,8,9
    `,
      { to: 2 },
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

  it("dont count headers", function (next) {
    parse(
      dedent`
        a,b,c
        1,2,3
        4,5,6
        7,8,9
      `,
      { columns: true, to: 2 },
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

  it('end stream when "to" is reached, further lines are not parsed', function (next) {
    parse(
      dedent`
        1,2,3\n4,5,6\n7,8
      `,
      { to: 2 },
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

  it("not influenced by lines", function (next) {
    parse(
      dedent`
        1,2,"
        3"
        4,5,"
        6"
        7,8,"
        9"
      `,
      { to: 2 },
      (err, records) => {
        if (!err) {
          records.should.eql([
            ["1", "2", "\n3"],
            ["4", "5", "\n6"],
          ]);
        }
        next(err);
      },
    );
  });

  it("not influenced by record delimiter", function (next) {
    parse(
      dedent`
        1,2,3:4,5,6:7,8,9
      `,
      { to: 2, record_delimiter: ":" },
      (err, records) => {
        if (!err) {
          records.should.eql([
            ["1", "2", "3"],
            ["4", "5", "6"],
          ]);
        }
        next(err);
      },
    );
  });
});
