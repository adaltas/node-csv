import "should";
import { stringify } from "../lib/index.js";

describe("Option `delimiter`", function () {
  it("validation", function () {
    (() => {
      stringify([], { delimiter: true });
    }).should.throw({
      code: "CSV_OPTION_DELIMITER_INVALID_TYPE",
      message: "option `delimiter` must be a buffer or a string, got true",
    });
    (() => {
      stringify([], { delimiter: false });
    }).should.throw({
      code: "CSV_OPTION_DELIMITER_INVALID_TYPE",
      message: "option `delimiter` must be a buffer or a string, got false",
    });
    (() => {
      stringify([], { delimiter: 123 });
    }).should.throw({
      code: "CSV_OPTION_DELIMITER_INVALID_TYPE",
      message: "option `delimiter` must be a buffer or a string, got 123",
    });
  });
});
