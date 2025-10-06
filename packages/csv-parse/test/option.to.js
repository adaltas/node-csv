import "should";
import { parse } from "../lib/index.js";

describe("Option `to`", function () {
  it("validation", function () {
    (() => {
      parse("", { to: true }, () => {});
    }).should.throw("Invalid Option: to must be an integer, got true");
    (() => {
      parse("", { to: false }, () => {});
    }).should.throw("Invalid Option: to must be an integer, got false");
  });
});
