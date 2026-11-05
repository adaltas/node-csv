import "should";
import { stringify, normalize_options } from "../lib/sync.js";

describe("Option `relax_quotes`", function () {
  it("normalisation defaults to false", function () {
    const [, options] = normalize_options({});
    options.relax_quotes.should.eql(false);
  });

  it("preserves interior quotes in unquoted fields", function () {
    stringify([['ab"c"', 'd"ef', 'hi""j']], {
      relax_quotes: true,
    }).should.eql('ab"c",d"ef,hi""j\n');
  });

  it("still quotes delimiters and record delimiters", function () {
    stringify([['a"b",c'], ['d"e"\nf'], ['h"i"\rj']], {
      relax_quotes: true,
    }).should.eql(['"a""b"",c"', '"d""e""\nf"', '"h""i""\rj"', ""].join("\n"));
  });

  it("still quotes leading quotes", function () {
    stringify([['"abc"', '"def', ' "hij"']], {
      relax_quotes: true,
    }).should.eql('"""abc""","""def"," ""hij"""\n');
  });

  it("respects explicit quoting selectors", function () {
    for (const options of [
      { quoted: true },
      { quoted_string: true },
      { quoted_match: /def/ },
    ]) {
      stringify([['abc "def"']], {
        relax_quotes: true,
        ...options,
      }).should.eql('"abc ""def"""\n');
    }
  });

  it("escapes custom quotes only when enclosing the field", function () {
    stringify([["a|b\\c", "a|b\\c,d", "|a\\b"]], {
      relax_quotes: true,
      quote: "|",
      escape: "\\",
    }).should.eql("a|b\\c,|a\\|b\\\\c,d|,|\\|a\\\\b|\n");
  });

  it("supports multi-character quotes and delimiters", function () {
    stringify([["a||b", "||a", "a||b::c"]], {
      relax_quotes: true,
      quote: "||",
      delimiter: "::",
    }).should.eql('a||b::||"||a||::||a"||b::c||\n');
  });

  it("supports field-level cast options", function () {
    stringify([[1, 2]], {
      cast: {
        number: (value) => ({
          value: `say "${value}"`,
          relax_quotes: value === 1,
        }),
      },
    }).should.eql('say "1","say ""2"""\n');
  });
});
