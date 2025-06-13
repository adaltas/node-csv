import "should";
import { parse } from "../lib/index.js";

describe("Option `to_line`", function () {
  it("validation", function () {
    (() => {
      parse("", { to_line: "0" }, () => {});
    }).should.throw(
      'Invalid Option: to_line must be a positive integer greater than 0, got "0"',
    );
    (() => {
      parse("", { to_line: true }, () => {});
    }).should.throw("Invalid Option: to_line must be an integer, got true");
    (() => {
      parse("", { to_line: false }, () => {});
    }).should.throw("Invalid Option: to_line must be an integer, got false");
    (() => {
      parse("", { to_line: "oh no" }, () => {});
    }).should.throw('Invalid Option: to_line must be an integer, got "oh no"');
  });
});
