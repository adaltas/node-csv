import "should";

const { parse, stringify } = await import("../lib/sync.js");

describe("Option `relax_quotes`", function () {
  it("round trips without changing records or fields", function () {
    const options = { relax_quotes: true };
    const text = 'ab"c",def\n"hi,j","k\nlm"\n"""nop""",q"xy\n';
    stringify(parse(text, options), options).should.eql(text);
  });

  it("round trips with custom separators and escaping", function () {
    const options = {
      relax_quotes: true,
      delimiter: "::",
      record_delimiter: "__",
      quote: "|",
      escape: "\\",
    };
    const records = [
      ["a|b\\c", "a::b"],
      ["a__b", "|leading"],
    ];
    parse(stringify(records, options), options).should.eql(records);
  });

  it("preserves leading quotes when parsing with trim enabled", function () {
    const options = { relax_quotes: true, trim: true };
    const text = '" ""hi""",plain\n';
    const records = parse(text, options);
    parse(stringify(records, options), options).should.eql(records);
  });
});
