import "should";
import { parse } from "../lib/index.js";

describe("Option `ignore_last_delimiters`", function () {
  describe("validation & normalization", function () {
    it("throw error with invalid type", function () {
      (() => {
        parse({ ignore_last_delimiters: "invalid" });
      }).should.throw({
        code: "CSV_INVALID_OPTION_IGNORE_LAST_DELIMITERS",
        message: [
          "Invalid option `ignore_last_delimiters`:",
          "the value must be a boolean value or an integer,",
          'got "invalid"',
        ].join(" "),
      });
    });
  });
});
