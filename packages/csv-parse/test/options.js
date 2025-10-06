import "should";
import { parse } from "../lib/index.js";

describe("Options", function () {
  it("camel case options are not disposed", function () {
    const parser = parse({ recordDelimiter: ":" });
    (parser.options.recordDelimiter === undefined).should.be.true();
  });
});
