import "should";
import { parse } from "../lib/index.js";

describe("Option `on_skip`", function () {
  it("validation", function () {
    (() => {
      parse("", { on_skip: 1 }, () => {});
    }).should.throw("Invalid Option: on_skip must be a function, got 1");
  });
});
