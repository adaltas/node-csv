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
        if (!err) {
          records.should.eql([{ FIELD_1: "DEF" }, { FIELD_1: "JKL" }]);
        }
        next(err);
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
        if (!err) {
          records.should.eql([
            { FIELD_1: ["ABC", "DEF"] },
            { FIELD_1: ["GHI", "JKL"] },
          ]);
        }
        next(err);
      },
    );
  });
});
