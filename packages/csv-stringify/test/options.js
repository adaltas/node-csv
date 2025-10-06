import { stringify } from "../lib/index.js";

describe("Options", function () {
  it("underscore options", function () {
    const stringifier = stringify({ recordDelimiter: ":" });
    stringifier.options.record_delimiter.should.eql(":");
    (stringifier.options.recordDelimiter === undefined).should.be.true();
  });
});
