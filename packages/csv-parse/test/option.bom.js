import "should";
import { parse } from "../lib/index.js";

describe("Option `bom`", function () {
  it("validate", function () {
    (() => {
      parse({ bom: "ohno" }, () => {});
    }).should.throw({
      message: 'Invalid option bom: bom must be true, got "ohno"',
      code: "CSV_INVALID_OPTION_BOM",
    });
  });
});
