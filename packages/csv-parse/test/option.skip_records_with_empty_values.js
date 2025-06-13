import "should";
import { parse } from "../lib/index.js";

describe("Option `skip_records_with_empty_values`", function () {
  it("validation", function () {
    (() => {
      parse("", { skip_records_with_empty_values: 1 }, () => {});
    }).should.throw(
      "Invalid Option: skip_records_with_empty_values must be a boolean, got 1",
    );
    (() => {
      parse("", { skip_records_with_empty_values: "oh no" }, () => {});
    }).should.throw(
      'Invalid Option: skip_records_with_empty_values must be a boolean, got "oh no"',
    );
  });
});
