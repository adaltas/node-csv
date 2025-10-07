import "should";
import { stringify } from "../lib/index.js";

describe("Option `header`", function () {
  it("validation", function () {
    stringify([{ a: 1, b: 2 }], { header: true });
    (() => {
      stringify([{ a: 1, b: 2 }], { header: "a string" });
    }).should.throw({
      code: "CSV_INVALID_OPTION_HEADER",
      message: 'option `header` is expected to be a boolean, got "a string"',
    });
  });
});
