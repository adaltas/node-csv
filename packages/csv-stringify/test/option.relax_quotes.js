import "should";
import { stringify } from "../lib/index.js";

describe("Option `relax_quotes`", function () {
  it("validates boolean values", function () {
    (() => stringify([], { relax_quotes: 1 })).should.throw(
      "option `relax_quotes` must be a boolean, got 1",
    );
    (() => stringify([], { relax_quotes: "true" })).should.throw(
      'option `relax_quotes` must be a boolean, got "true"',
    );
  });
});
