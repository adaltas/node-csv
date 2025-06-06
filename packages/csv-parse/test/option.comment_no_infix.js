import "should";
import { parse } from "../lib/index.js";

describe("Option `comment_no_infix`", function () {
  it("validation", function () {
    (() => {
      parse("", { comment_no_infix: "" }, () => {});
    }).should.throw({
      message:
        'Invalid option comment_no_infix: value must be a boolean, got ""',
      code: "CSV_INVALID_OPTION_COMMENT",
    });
    (() => {
      parse("", { comment_no_infix: 2 }, () => {});
    }).should.throw({
      message:
        "Invalid option comment_no_infix: value must be a boolean, got 2",
      code: "CSV_INVALID_OPTION_COMMENT",
    });
  });
});
