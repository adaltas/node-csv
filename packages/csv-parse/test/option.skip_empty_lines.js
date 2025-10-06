import "should";
import { parse } from "../lib/index.js";

describe("Option `skip_empty_lines`", function () {
  it("validation", function () {
    (() => {
      parse("", { skip_empty_lines: 1 }, () => {});
    }).should.throw(
      "Invalid Option: skip_empty_lines must be a boolean, got 1",
    );
    (() => {
      parse("", { skip_empty_lines: "oh no" }, () => {});
    }).should.throw(
      'Invalid Option: skip_empty_lines must be a boolean, got "oh no"',
    );
  });
});
