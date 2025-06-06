import "should";
import { parse } from "../lib/index.js";

describe("Option `comment`", function () {
  it("validation", function () {
    (() => {
      parse("", { comment: 2 }, () => {});
    }).should.throw({
      message:
        "Invalid option comment: comment must be a buffer or a string, got 2",
      code: "CSV_INVALID_OPTION_COMMENT",
    });
  });
});
