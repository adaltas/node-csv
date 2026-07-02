import "should";
import dedent from "dedent";
import { stringify } from "../lib/index.js";
import { stringify as stringifySync } from "../lib/sync.js";

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

  it("regexp metacharacter escape is doubled literally (fix #494)", function () {
    // The escape character was interpolated into `new RegExp(escape, "g")`.
    // Metacharacters (| . * + ? ( [ { ^ $ ...) broke the doubling: "|" and
    // "." matched everywhere, "*" threw "Nothing to repeat", "$" anchored.
    // A field that must be quoted and contains the escape char must have every
    // literal escape occurrence doubled, whatever the character.
    // Before #494, the returned value was `"||a|||||b||,||c||"`
    stringifySync([["a|b,c"]], { escape: "|", eof: false }).should.eql(
      '"a||b,c"',
    );
    // Before #494, the returned value was `..........`
    stringifySync([["a.b,c"]], { escape: ".", eof: false }).should.eql(
      '"a..b,c"',
    );
    // Before #494, an error was thrown `Invalid regular expression: /*/g: Nothing to repeat`
    stringifySync([["a*b,c"]], { escape: "*", eof: false }).should.eql(
      '"a**b,c"',
    );
    // "$" is also special in the replacement string, not only the pattern.
    // Before #494, the returned value was `"a$b,c$"`
    stringifySync([["a$b,c"]], { escape: "$", eof: false }).should.eql(
      '"a$$b,c"',
    );
  });
});
