import "should";
import { parse } from "../lib/index.js";

describe("Option `max_record_size`", function () {
  it("validation", function () {
    (() => {
      parse("", { max_record_size: true }, () => {});
    }).should.throw(
      "Invalid Option: max_record_size must be a positive integer, got true",
    );
  });
});
