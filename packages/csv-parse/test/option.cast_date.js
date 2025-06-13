import "should";
import { parse } from "../lib/index.js";

describe("Option `cast_date`", function () {
  it("validate", function () {
    (() => {
      parse({ cast: true, cast_date: "ohno" }, () => {});
    }).should.throw({
      message:
        'Invalid option cast_date: cast_date must be true or a function, got "ohno"',
      code: "CSV_INVALID_OPTION_CAST_DATE",
    });
  });
});
