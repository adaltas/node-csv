import "should";
import { parse } from "../lib/index.js";

describe("Option `relax_column_count`", function () {
  it("validation", function () {
    (() => {
      parse("", { relax_column_count: 1 }, () => {});
    }).should.throw(
      "Invalid Option: relax_column_count must be a boolean, got 1",
    );
    (() => {
      parse("", { relax_column_count: "oh no" }, () => {});
    }).should.throw(
      'Invalid Option: relax_column_count must be a boolean, got "oh no"',
    );
  });
});
