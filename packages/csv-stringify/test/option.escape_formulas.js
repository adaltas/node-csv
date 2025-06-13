import "should";
import { stringify } from "../lib/index.js";

describe("Option `escape_formulas`", function () {
  it("validation", function () {
    (() => {
      stringify([["abc", "def"]], { escape_formulas: "invalid" });
    }).should.throw({
      code: "CSV_OPTION_ESCAPE_FORMULAS_INVALID_TYPE",
      message: 'option `escape_formulas` must be a boolean, got "invalid"',
    });
  });
});
