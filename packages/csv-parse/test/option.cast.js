import "should";
import { parse } from "../lib/index.js";

describe("Option `cast`", function () {
  it("validate", function () {
    (() => {
      parse({ cast: "ohno" }, () => {});
    }).should.throw({
      message:
        'Invalid option cast: cast must be true or a function, got "ohno"',
      code: "CSV_INVALID_OPTION_CAST",
    });
  });
});
