import "should";
import assert from "node:assert/strict";
import { parse as parseSync } from "../lib/sync.js";
import { parse } from "../lib/index.js";

describe("Option `group_columns_by_name`", function () {
  it("validate", function () {
    (() => {
      parse("", { group_columns_by_name: "invalid" });
    }).should.throw({
      code: "CSV_INVALID_OPTION_GROUP_COLUMNS_BY_NAME",
      message:
        'Invalid option group_columns_by_name: expect a boolean, got "invalid"',
    });
  });
  for (const values of [
    [[1], [2], [3]],
    [1, [2], []],
    [[], [], [3]],
  ]) {
    it(`preserves cast values ${JSON.stringify(values)} when grouping columns`, function () {
      let index = 0;
      const records = parseSync("1,2,3", {
        columns: ["value", "value", "value"],
        group_columns_by_name: true,
        cast: () => values[index++],
      });
      assert.deepStrictEqual(records, [{ value: values }]);
    });
  }
});
