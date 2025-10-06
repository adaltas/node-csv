import "should";
import { parse } from "../lib/index.js";

describe("Option `raw`", function () {
  it("validation", function () {
    (() => parse("", { raw: "" }, () => {})).should.throw(
      'Invalid Option: raw must be true, got ""',
    );
    (() => parse("", { raw: 2 }, () => {})).should.throw(
      "Invalid Option: raw must be true, got 2",
    );
  });
});
