import "should";
import dedent from "dedent";
import { stringify } from "../lib/index.js";

describe("Option `escape_formulas`", function () {
  it("default to `false`", function (next) {
    const stringifier = stringify([["abc", "def"]], () => {
      stringifier.options.escape_formulas.should.be.false();
      next();
    });
  });

  it("escape =, +, -, @, \\t, \\r and unicode equivalent signs", function (next) {
    stringify(
      [
        ["=a", 1],
        ["+b", 2],
        ["-c", 3],
        ["@d", 4],
        ["\te", 5],
        ["\rf", 6],
        ["g", 7],
        ["\uFF1Dh", 8],
        ["\uFF0Bi", 9],
        ["\uFF0Dj", 10],
        ["\uFF20k", 11],
        ["\uFF0Cl", 12], // \uFF0C is 'full width comma' and should not be escaped
      ],
      {
        escape_formulas: true,
        eof: false,
      },
      (err, data) => {
        if (err) return next(err);
        data.should.eql(
          [
            "'=a,1",
            "'+b,2",
            "'-c,3",
            "'@d,4",
            "'\te,5",
            "'\rf,6",
            "g,7",
            "'\uFF1Dh,8",
            "'\uFF0Bi,9",
            "'\uFF0Dj,10",
            "'\uFF20k,11",
            "\uFF0Cl,12",
          ].join("\n"),
        );
        next();
      },
    );
  });

  it("with `quoted` option", function (next) {
    stringify(
      [
        ["=a", 1],
        ["b", 2],
      ],
      {
        escape_formulas: true,
        quoted: true,
        eof: false,
      },
      (err, data) => {
        if (err) return next(err);
        data.should.eql(dedent`
          "'=a","1"
          "b","2"
        `);
        next();
      },
    );
  });
});
