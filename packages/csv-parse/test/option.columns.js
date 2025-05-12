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

    it("check the columns is not a boolean", function () {
      (() => {
        parse("", { columns: [{ name: "valid" }, true] }, () => {});
      }).should.throw({
        message:
          "Invalid column definition: expect a string or a literal object, got true at position 1",
        code: "CSV_INVALID_COLUMN_DEFINITION",
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

    it("skip columns with false value", function (next) {
      parse(
        "1,2,3,4\n5,6,7,8",
        {
          columns: ["a", false, "c", false],
        },
        (err, records) => {
          if (!err) {
            records.should.eql([
              { a: "1", c: "3" },
              { a: "5", c: "7" },
            ]);
          }
          next(err);
        },
      );
    });

    it("dont mutate options", function (next) {
      const columns = ["a", false, "c", false];
      parse(
        "1,2,3,4\n5,6,7,8",
        {
          columns: columns,
        },
        (err) => {
          if (!err) {
            columns.should.eql(["a", false, "c", false]);
          }
          next(err);
        },
      );
    });
  });

  describe("duplicate column names", function () {
    it("with true", function (next) {
      parse(
        "a,b,a,c\n1,2,3,4\n5,6,7,8",
        {
          columns: true,
        },
        (err, records) => {
          if (!err) {
            records.should.eql([
              { a: "3", b: "2", c: "4" },
              { a: "7", b: "6", c: "8" },
            ]);
          }
          next(err);
        },
      );
    });

    it("with array", function (next) {
      const columns = ["a", "b", "a", "c"];
      parse(
        "1,2,3,4\n5,6,7,8",
        {
          columns: columns,
        },
        (err, records) => {
          if (!err) {
            records.should.eql([
              { a: "3", b: "2", c: "4" },
              { a: "7", b: "6", c: "8" },
            ]);
          }
          next(err);
        },
      );
    });

    it("lines with empty column names", function (next) {
      parse(
        ",,,\n1,2,3,4\n5,6,7,8",
        {
          columns: true,
        },
        (err, records) => {
          if (!err) {
            records.should.eql([{ "": "4" }, { "": "8" }]);
          }
          next(err);
        },
      );
    });
  });

  describe("boolean", function () {
    it("read from first row if true", function (next) {
      parse(
        "FIELD_1,FIELD_2,FIELD_3,FIELD_4,FIELD_5,FIELD_6\n20322051544,1979,8.8017226E7,ABC,45,2000-01-01\n28392898392,1974,8.8392926E7,DEF,23,2050-11-27",
        {
          columns: true,
        },
        (err, records) => {
          if (!err) {
            records.should.eql([
              {
                FIELD_1: "20322051544",
                FIELD_2: "1979",
                FIELD_3: "8.8017226E7",
                FIELD_4: "ABC",
                FIELD_5: "45",
                FIELD_6: "2000-01-01",
              },
              {
                FIELD_1: "28392898392",
                FIELD_2: "1974",
                FIELD_3: "8.8392926E7",
                FIELD_4: "DEF",
                FIELD_5: "23",
                FIELD_6: "2050-11-27",
              },
            ]);
          }
          next(err);
        },
      );
    });

    it("disabled if false", function (next) {
      parse(
        "a,b,c\nd,e,f",
        {
          columns: false,
        },
        (err, records) => {
          if (!err) {
            records.should.eql([
              ["a", "b", "c"],
              ["d", "e", "f"],
            ]);
          }
          next(err);
        },
      );
    });

    it("header detection honors skip_empty_lines", function (next) {
      parse(
        "\na,b,c\n1,2,3",
        {
          columns: true,
          skip_empty_lines: true,
        },
        (err, records) => {
          if (!err) {
            records.should.eql([{ a: "1", b: "2", c: "3" }]);
          }
          next(err);
        },
      );
    });

    it("header detection honors skip_records_with_empty_values", function (next) {
      parse(
        ",,\na,b,c\n1,2,3",
        {
          columns: true,
          skip_records_with_empty_values: true,
        },
        (err, records) => {
          if (!err) {
            records.should.eql([{ a: "1", b: "2", c: "3" }]);
          }
          next(err);
        },
      );
    });
  });

  describe("array", function () {
    it("enforced by user if array", function (next) {
      parse(
        "20322051544,1979,8.8017226E7,ABC,45,2000-01-01\n28392898392,1974,8.8392926E7,DEF,23,2050-11-27",
        {
          columns: [
            "FIELD_1",
            "FIELD_2",
            "FIELD_3",
            "FIELD_4",
            "FIELD_5",
            "FIELD_6",
          ],
        },
        (err, records) => {
          if (!err) {
            records.should.eql([
              {
                FIELD_1: "20322051544",
                FIELD_2: "1979",
                FIELD_3: "8.8017226E7",
                FIELD_4: "ABC",
                FIELD_5: "45",
                FIELD_6: "2000-01-01",
              },
              {
                FIELD_1: "28392898392",
                FIELD_2: "1974",
                FIELD_3: "8.8392926E7",
                FIELD_4: "DEF",
                FIELD_5: "23",
                FIELD_6: "2050-11-27",
              },
            ]);
          }
          next(err);
        },
      );
    });

    it("validate options column length on first line", function (next) {
      parse(
        "1,2,3\n4,5,6,x\n7,8,9,x",
        {
          columns: ["a", "b", "c", "d"],
        },
        (err) => {
          assert_error(err, {
            message:
              "Invalid Record Length: columns length is 4, got 3 on line 1",
            code: "CSV_RECORD_INCONSISTENT_COLUMNS",
          });
          next();
        },
      );
    });

    it("validate options column length on last line", function (next) {
      parse(
        "1,2,3,x\n4,5,6,x\n7,8,9",
        {
          columns: ["a", "b", "c", "d"],
        },
        (err) => {
          assert_error(err, {
            message:
              "Invalid Record Length: columns length is 4, got 3 on line 3",
            code: "CSV_RECORD_INCONSISTENT_COLUMNS",
          });
          next();
        },
      );
    });

    it("context column is null when cast force the context creation", function (next) {
      parse(
        "a\nb,\n",
        {
          columns: true,
          cast: (value) => value,
        },
        (err) => {
          assert_error(err, {
            message:
              "Invalid Record Length: columns length is 1, got 2 on line 2",
            code: "CSV_RECORD_INCONSISTENT_COLUMNS",
            column: null,
          });
          next();
        },
      );
    });

    it("context column is null when columns number inferieur to record length, fix regression #259", function (next) {
      parse(
        "a\nb,\n",
        {
          columns: true,
        },
        (err) => {
          assert_error(err, {
            message:
              "Invalid Record Length: columns length is 1, got 2 on line 2",
            code: "CSV_RECORD_INCONSISTENT_COLUMNS",
            column: null,
          });
          next();
        },
      );
    });

    it("skips column names defined as undefined", function (next) {
      parse(
        "0,1,2,3,4\n5,6,7,8,9",
        {
          columns: ["a", undefined, undefined, undefined, "b"],
        },
        (err, records) => {
          if (!err) {
            records.should.eql([
              { a: "0", b: "4" },
              { a: "5", b: "9" },
            ]);
          }
          next(err);
        },
      );
    });

    it("skips column names defined as false", function (next) {
      parse(
        "0,1,2,3,4\n5,6,7,8,9",
        {
          columns: ["a", false, false, false, "b"],
        },
        (err, records) => {
          if (!err) {
            records.should.eql([
              { a: "0", b: "4" },
              { a: "5", b: "9" },
            ]);
          }
          next(err);
        },
      );
    });

    it("skips column names defined as null and last", function (next) {
      parse(
        "0,1,2\n3,4,5",
        {
          columns: ["a", null, null],
        },
        (err, records) => {
          if (!err) {
            records.should.eql([{ a: "0" }, { a: "3" }]);
          }
          next(err);
        },
      );
    });

    it("illustrate bug with undefined values", function (next) {
      parse(
        "0,1,2\n3,4,5",
        {
          columns: ["a", undefined, undefined],
        },
        (err, records) => {
          if (!err) {
            records.should.eql([{ a: "0" }, { a: "3" }]);
          }
          next(err);
        },
      );
    });

    it("last column value ignore when `null`", function (next) {
      parse(
        "col_a,col_b,col_c\nfoo,bar\nfoo,bar,baz",
        {
          columns: ["a", "b", null],
        },
        (err) => {
          err.code.should.eql("CSV_RECORD_INCONSISTENT_COLUMNS");
          next();
        },
      );
    });
  });

  describe("function", function () {
    it("takes first line as argument", function (next) {
      parse(
        "FIELD_1,FIELD_2,FIELD_3,FIELD_4,FIELD_5,FIELD_6\n20322051544,1979,8.8017226E7,ABC,45,2000-01-01\n28392898392,1974,8.8392926E7,DEF,23,2050-11-27",
        {
          columns: (record) => record.map((column) => column.toLowerCase()),
        },
        (err, records) => {
          if (!err) {
            records.should.eql([
              {
                field_1: "20322051544",
                field_2: "1979",
                field_3: "8.8017226E7",
                field_4: "ABC",
                field_5: "45",
                field_6: "2000-01-01",
              },
              {
                field_1: "28392898392",
                field_2: "1974",
                field_3: "8.8392926E7",
                field_4: "DEF",
                field_5: "23",
                field_6: "2050-11-27",
              },
            ]);
          }
          next(err);
        },
      );
    });

    it("catch thrown errors", function (next) {
      parse(
        "FIELD_1,FIELD_2,FIELD_3,FIELD_4\nabc,123,def,456\nhij,789,klm,0",
        {
          columns: () => {
            throw Error("Catchme");
          },
        },
        (err) => {
          err.message.should.eql("Catchme");
          next();
        },
      );
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
