import "should";
import dedent from "dedent";
import { parse } from "../lib/index.js";

describe("Option `from`", function () {
  it("validation", function () {
    parse("", { from: 10 }, () => {});
    parse("", { from: "10" }, () => {});
    (() => {
      parse("", { from: -1 }, () => {});
    }).should.throw("Invalid Option: from must be a positive integer, got -1");
    (() => {
      parse("", { from: "-1" }, () => {});
    }).should.throw(
      'Invalid Option: from must be a positive integer, got "-1"',
    );
    (() => {
      parse("", { from: "oh no" }, () => {});
    }).should.throw('Invalid Option: from must be an integer, got "oh no"');
  });

  it("start at defined position", function (next) {
    parse(
      dedent`
        1,2,3
        4,5,6
        7,8,9
      `,
      { from: 3 },
      (err, records) => {
        if (!err) {
          records.should.eql([["7", "8", "9"]]);
        }
        next(err);
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
      { columns: true, from: 3 },
      (err, records) => {
        if (!err) {
          records.should.eql([{ a: "7", b: "8", c: "9" }]);
        }
        next(err);
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
      { from: 3 },
      (err, records) => {
        if (!err) {
          records.should.eql([["7", "8", "\n9"]]);
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
      { from: 3, record_delimiter: ":" },
      (err, records) => {
        if (!err) {
          records.should.eql([["7", "8", "9"]]);
        }
        next(err);
      },
    );
  });
});
