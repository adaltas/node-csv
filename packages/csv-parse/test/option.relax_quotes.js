import "should";
import { parse } from "../lib/index.js";

describe("Option `relax_quotes`", function () {
  it("validation", function () {
    (() => {
      parse("", { relax_quotes: 1 }, () => {});
    }).should.throw("Invalid Option: relax_quotes must be a boolean, got 1");
    (() => {
      parse("", { relax_quotes: "oh no" }, () => {});
    }).should.throw(
      'Invalid Option: relax_quotes must be a boolean, got "oh no"',
    );
  });
});
