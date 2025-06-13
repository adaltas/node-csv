import "should";
import { parse } from "../lib/index.js";

describe("Option `rtrim`", function () {
  it("validation", function () {
    (() => {
      parse("", { rtrim: 1 }, () => {});
    }).should.throw("Invalid Option: rtrim must be a boolean, got 1");
    (() => {
      parse("", { rtrim: "true" }, () => {});
    }).should.throw('Invalid Option: rtrim must be a boolean, got "true"');
  });
});
