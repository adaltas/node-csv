import "should";
import { parse } from "../lib/index.js";

describe("Option `from`", function () {
  it("validation", function () {
    (() => {
      parse("", { from: true }, () => {});
    }).should.throw("Invalid Option: from must be an integer, got true");
    (() => {
      parse("", { from: false }, () => {});
    }).should.throw("Invalid Option: from must be an integer, got false");
  });
});
