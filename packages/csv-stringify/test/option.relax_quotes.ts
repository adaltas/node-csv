import "should";
import { stringify } from "../lib/index.js";
import { stringify as stringifySync, normalize_options } from "../lib/sync.js";

describe("Option `relax_quotes`", function () {
  it("defaults to false", function () {
    const [, options] = normalize_options({});
    options.relax_quotes.should.eql(false);
    stringifySync([['say "hi"']]).should.eql('"say ""hi"""\n');
    stringifySync([['say "hi"']], { relax_quotes: false }).should.eql(
      '"say ""hi"""\n',
    );
  });

  it("preserves interior quotes in unquoted fields", function () {
    stringifySync([['say "hi"', 'a"b', 'a""b']], {
      relax_quotes: true,
    }).should.eql('say "hi",a"b,a""b\n');
  });

  it("still quotes delimiters and line breaks", function () {
    stringifySync([['say "hi", bob'], ['say "hi"\nbob'], ['say "hi"\rbob']], {
      relax_quotes: true,
    }).should.eql('"say ""hi"", bob"\n"say ""hi""\nbob"\n"say ""hi""\rbob"\n');
  });

  it("still quotes leading quotes", function () {
    stringifySync([['"hi"', '"unfinished', ' "hi"']], {
      relax_quotes: true,
    }).should.eql('"""hi""","""unfinished"," ""hi"""\n');
  });

  it("respects explicit quoting selectors", function () {
    for (const options of [
      { quoted: true },
      { quoted_string: true },
      { quoted_match: /hi/ },
    ]) {
      stringifySync([['say "hi"']], {
        relax_quotes: true,
        ...options,
      }).should.eql('"say ""hi"""\n');
    }
  });

  it("escapes custom quotes only when enclosing the field", function () {
    stringifySync([["a|b\\c", "a|b\\c,d", "|a\\b"]], {
      relax_quotes: true,
      quote: "|",
      escape: "\\",
    }).should.eql("a|b\\c,|a\\|b\\\\c,d|,|\\|a\\\\b|\n");
  });

  it("supports multi-character quotes and delimiters", function () {
    stringifySync([["a||b", "||a", "a||b::c"]], {
      relax_quotes: true,
      quote: "||",
      delimiter: "::",
    }).should.eql('a||b::||"||a||::||a"||b::c||\n');
  });

  it("supports the callback API", function (next) {
    stringify([['say "hi"', 'a,"b"']], { relax_quotes: true }, (err, data) => {
      if (err) return next(err);
      data.should.eql('say "hi","a,""b"""\n');
      next();
    });
  });

  it("supports field-level cast options", function () {
    stringifySync([[1, 2]], {
      cast: {
        number: (value) => ({
          value: `say "${value}"`,
          relax_quotes: value === 1,
        }),
      },
    }).should.eql('say "1","say ""2"""\n');
  });
});
