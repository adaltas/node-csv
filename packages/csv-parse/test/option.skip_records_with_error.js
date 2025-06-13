import "should";
import { parse } from "../lib/index.js";

describe("Option `skip_records_with_error`", function () {
  it("validation", function () {
    (() => {
      parse("", { skip_records_with_error: 1 }, () => {});
    }).should.throw(
      "Invalid Option: skip_records_with_error must be a boolean, got 1",
    );
    (() => {
      parse("", { skip_records_with_error: "oh no" }, () => {});
    }).should.throw(
      'Invalid Option: skip_records_with_error must be a boolean, got "oh no"',
    );
  });
});
