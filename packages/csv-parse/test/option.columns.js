import "should";
import { parse } from "../lib/index.js";
import { assert_error } from "./api.assert_error.js";

describe("Option `columns`", function () {
  describe("validation", function () {
    it("check the columns value", function () {
      (() => {
        parse(
          "",
          {
            columns: [
              {
                name: "valid",
              },
              {
                invalid: "oh no",
              },
            ],
          },
          () => {},
        );
      }).should.throw({
        message:
          'Option columns missing name: property "name" is required at position 1 when column is an object literal',
        code: "CSV_OPTION_COLUMNS_MISSING_NAME",
      });
    });

    it("check the columns options is not empty", function () {
      (() => {
        parse("", { columns: {} }, () => {});
      }).should.throw({
        message:
          "Invalid option columns: expect an array, a function or true, got {}",
        code: "CSV_INVALID_OPTION_COLUMNS",
      });
    });

    it("check the columns is not a boolean", function () {
      (() => {
        parse("", { columns: [{ name: "valid" }, true] }, () => {});
      }).should.throw({
        message:
          "Invalid column definition: expect a string or a literal object, got true at position 1",
        code: "CSV_INVALID_COLUMN_DEFINITION",
      });
    });

    it("must return an array of headers", function (next) {
      parse(
        "FIELD_1\nabc",
        {
          columns: () => {
            return { FIELD: true };
          },
        },
        (err) => {
          assert_error(err, {
            message:
              'Invalid Column Mapping: expect an array from column function, got {"FIELD":true}',
            code: "CSV_INVALID_COLUMN_MAPPING",
            headers: { FIELD: true },
          });
          next();
        },
      );
    });
  });
});
