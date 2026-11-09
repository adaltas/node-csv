import "should";
import { parse } from "../lib/index.js";
import { parse as parseSync } from "../lib/sync.js";

describe("Option `group_columns_by_name`", function () {
  it("require columns to be active", function () {
    (() => {
      parse("", { group_columns_by_name: true });
    }).should.throw({
      code: "CSV_INVALID_OPTION_GROUP_COLUMNS_BY_NAME",
      message:
        "Invalid option group_columns_by_name: the `columns` mode must be activated.",
    });
  });

  it("when false", function (next) {
    parse(
      "FIELD_1,FIELD_1\nABC,DEF\nGHI,JKL",
      {
        columns: true,
        group_columns_by_name: false,
      },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([{ FIELD_1: "DEF" }, { FIELD_1: "JKL" }]);
        next();
      },
    );
  });

  it("when true", function (next) {
    parse(
      "FIELD_1,FIELD_1\nABC,DEF\nGHI,JKL",
      {
        columns: true,
        group_columns_by_name: true,
      },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([
          { FIELD_1: ["ABC", "DEF"] },
          { FIELD_1: ["GHI", "JKL"] },
        ]);
        next();
      },
    );
  });

  it("preserves array-valued casts instead of treating them as groups", function () {
    const records = parseSync("1,2,3", {
      columns: ["value", "value", "value"],
      group_columns_by_name: true,
      cast: (value) => [Number(value)],
    });
    records.should.eql([{ value: [[1], [2], [3]] }]);
  });

  it("preserves an array-valued cast appended to an existing group", function () {
    const records = parseSync("1,2,3", {
      columns: ["value", "value", "value"],
      group_columns_by_name: true,
      cast: (value, context) =>
        context.index === 2 ? [Number(value)] : Number(value),
    });
    records.should.eql([{ value: [1, 2, [3]] }]);
  });

  it("keeps empty arrays as individual cast values", function () {
    const records = parseSync("1,2,3", {
      columns: ["value", "value", "value"],
      group_columns_by_name: true,
      cast: () => [],
    });
    records.should.eql([{ value: [[], [], []] }]);
  });
});
