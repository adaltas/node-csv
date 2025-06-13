import "should";
import { parse } from "../lib/index.js";

describe("Option `on_record`", function () {
  it("validate", function () {
    (() => {
      parse({ on_record: true });
    }).should.throw({
      message: "Invalid option `on_record`: expect a function, got true",
      code: "CSV_INVALID_OPTION_ON_RECORD",
    });
  });
});
