import "should";
import { parse } from "../lib/index.js";

describe("Option `group_columns_by_name`", function () {
  it("validate", function () {
    (() => {
      parse("", { group_columns_by_name: "invalid" });
    }).should.throw({
      code: "CSV_INVALID_OPTION_GROUP_COLUMNS_BY_NAME",
      message:
        'Invalid option group_columns_by_name: expect an boolean, got "invalid"',
    });
  });
});
