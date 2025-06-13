import "should";
import { stringify } from "../lib/index.js";
import { stringify as stringifySync } from "../lib/sync.js";

describe("Option `bom`", function () {
  it("validate", function () {
    (() => {
      stringify([], { bom: "invalid" }, () => {});
    }).should.throw({
      code: "CSV_OPTION_BOOLEAN_INVALID_TYPE",
      message:
        'option `bom` is optional and must be a boolean value, got "invalid"',
    });
  });

  describe("sync ", function () {
    it("validate", function () {
      (() => {
        stringifySync([], { bom: "invalid" });
      }).should.throw({
        code: "CSV_OPTION_BOOLEAN_INVALID_TYPE",
        message:
          'option `bom` is optional and must be a boolean value, got "invalid"',
      });
    });
  });
});
