import "should";
import { parse } from "../lib/index.js";

describe("Option `delimiter`", function () {
  it("validation", function () {
    (() => {
      parse("", { delimiter: true }, () => {});
    }).should.throw({
      message:
        "Invalid option delimiter: delimiter must be a non empty string or buffer or array of string|buffer, got true",
      code: "CSV_INVALID_OPTION_DELIMITER",
    });
  });
});
