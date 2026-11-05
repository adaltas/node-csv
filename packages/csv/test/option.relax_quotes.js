import "should";

const { parse, stringify } = await import("../lib/sync.js");

describe("Option `relax_quotes`", function () {
  it("round trips relaxed quotes without changing records or fields", function () {
    const options = { relax_quotes: true };
    const text = 'say "hi",plain\n"a,b","a\nb"\n"""hi""",a"b\n';
    const records = parse(text, options);
    const output = stringify(records, options);
    output.should.eql(text);
    parse(output, options).should.eql(records);
    records.should.have.length(3);
    records.forEach((record) => record.should.have.length(2));
  });

  it("round trips relaxed quotes with custom separators and escaping", function () {
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
    const output = stringify(records, options);
    output.should.startWith("a|b\\c::");
    parse(output, options).should.eql(records);
  });

  it("preserves leading quotes when parsing with trim enabled", function () {
    const options = { relax_quotes: true, trim: true };
    const text = '" ""hi""",plain\n';
    const records = parse(text, options);
    parse(stringify(records, options), options).should.eql(records);
  });
});
