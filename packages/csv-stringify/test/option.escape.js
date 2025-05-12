import "should";
import dedent from "dedent";
import { stringify } from "../lib/index.js";

describe("Option `escape`", function () {
  it("default", function (next) {
    const stringifier = stringify([["abc", "def"]], () => {
      stringifier.options.escape.should.eql('"');
      next();
    });
  });

  it("validation", function () {
    stringify([], { escape: "," });
    stringify([], { escape: Buffer.from(",") });
    (() => {
      stringify([], { escape: true });
    }).should.throw(
      "Invalid Option: escape must be a buffer or a string, got true",
    );
    (() => {
      stringify([], { escape: false });
    }).should.throw(
      "Invalid Option: escape must be a buffer or a string, got false",
    );
    (() => {
      stringify([], { escape: 123 });
    }).should.throw(
      "Invalid Option: escape must be a buffer or a string, got 123",
    );
    (() => {
      stringify([], { escape: "XX" });
    }).should.throw(
      "Invalid Option: escape must be one character, got 2 characters",
    );
  });

  it("only apply to quote and escape characters", function (next) {
    stringify(
      [
        ["-", '1"2'],
        ["-", '"'],
        ["-", '"abc'],
        ["-", 'def"'],
      ],
      { escape: '"', eof: false },
      (err, data) => {
        if (err) return next(err);
        data.should.eql(dedent`
          -,"1""2"
          -,""""
          -,"""abc"
          -,"def"""
        `);
        next();
      },
    );
  });

  it("escape delimiter", function (next) {
    stringify(
      [["a", "b,c", "d"]],
      { escape: '"', delimiter: ",", eof: false },
      (err, data) => {
        if (err) return next(err);
        data.should.eql('a,"b,c",d');
        next();
      },
    );
  });

  it("escape record_delimiter", function (next) {
    stringify(
      [["a", "b\nc", "d"]],
      { escape: '"', record_delimiter: "\n", eof: false },
      (err, data) => {
        if (err) return next(err);
        data.should.eql('a,"b\nc",d');
        next();
      },
    );
  });

  it("should honor the backslash escape characters", function (next) {
    stringify(
      [
        ['1"2', '3"4"5'],
        ["\\abc", "def\\"],
        ["escape and quote", '\\"'],
      ],
      { escape: "\\", eof: false },
      (err, data) => {
        if (err) return next(err);
        data.should.eql(
          [
            '"1\\"2","3\\"4\\"5"',
            "\\abc,def\\",
            'escape and quote,"\\\\\\""',
          ].join("\n"),
        );
        next();
      },
    );
  });
});
