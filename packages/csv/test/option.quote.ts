import "should";
import { parse, stringify } from "../lib/sync.js";

describe("Option `quote`", function () {
  it("no special character", function () {
    const text = '"abc","def"';
    // Note, it is expected for the original CSV to be simplified by a round trip
    const normalized = `abc,def\n`;
    stringify(parse(text)).should.eql(normalized);
    parse(stringify(parse(text))).should.eql(parse(text));
  });

  it("delimiter", function () {
    const text = '"ab,c",",def"\n';
    stringify(parse(text)).should.eql(text);
  });

  it("record delimiter", function () {
    const text = '"ab\nc"\n"\ndef"';
    const normalized = `${text}\n`;
    stringify(parse(text)).should.eql(normalized);
    parse(stringify(parse(text))).should.eql(parse(text));
  });
});
