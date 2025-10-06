import "should";
import { parse } from "../lib/index.js";

describe("Option `ltrim`", function () {
  it("validation", function () {
    (() => {
      parse("", { ltrim: 1 }, () => {});
    }).should.throw("Invalid Option: ltrim must be a boolean, got 1");
    (() => {
      parse("", { ltrim: "true" }, () => {});
    }).should.throw('Invalid Option: ltrim must be a boolean, got "true"');
  });
});
