import "should";
import { parse } from "../lib/index.js";

describe("Option `trim`", function () {
  it("validation", function () {
    (() => {
      parse("", { trim: 1 }, () => {});
    }).should.throw("Invalid Option: trim must be a boolean, got 1");
    (() => {
      parse("", { trim: "true" }, () => {});
    }).should.throw('Invalid Option: trim must be a boolean, got "true"');
  });
});
