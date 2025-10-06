import "should";
import { parse } from "../lib/index.js";
import { assert_error } from "./api.assert_error.js";

describe("Option `cast`", function () {
  describe("boolean true", function () {
    it("all columns", function (next) {
      parse("1,2,3", { cast: true }, (err, records) => {
        if (!err) records.should.eql([[1, 2, 3]]);
        next();
      });
    });

    it("convert numbers", function (next) {
      const records: string[] = [];
      const parser = parse({ cast: true });
      parser.write(
        "20322051544,1979,8.8017226E7,8e2,ABC,45,2000-01-01\n28392898392,1974,8.8392926e7,8E2,DEF,23,2050-11-27",
      );
      parser.on("readable", () => {
        let d;
        while ((d = parser.read())) {
          records.push(d);
        }
      });
      parser.on("error", (err) => {
        next(err);
      });
      parser.on("end", () => {
        records.should.eql([
          [20322051544, 1979, 8.8017226e7, 800, "ABC", 45, "2000-01-01"],
          [28392898392, 1974, 8.8392926e7, 800, "DEF", 23, "2050-11-27"],
        ]);
        next();
      });
      parser.end();
    });

    it("ints", function (next) {
      parse(
        "123a,123,+123,-123,0123,+0123,-0123,",
        { cast: true },
        (err, records) => {
          records.should.eql([["123a", 123, 123, -123, 123, 123, -123, ""]]);
          next();
        },
      );
    });

    it("int isn't exposed to DOS vulnerabilities, npm security issue 69742", function (next) {
      const data =
        Array.from({ length: 3000000 })
          .map(() => "1")
          .join("") + "!";
      parse(data, { cast: true }, (err, records) => {
        records[0][0].length.should.eql(3000001);
        next();
      });
    });

    it("float", function (next) {
      parse(
        "123a,1.23,0.123,01.23,.123,123.",
        { cast: true },
        (err, records) => {
          records.should.eql([["123a", 1.23, 0.123, 1.23, 0.123, 123]]);
          next();
        },
      );
    });
  });

  describe("function", function () {
    it("custom function", function (next) {
      parse(
        "hello",
        {
          cast: (value, context) => Object.keys(context).sort(),
        },
        (err, records) => {
          if (err) return next(err);
          records.should.eql([
            [
              [
                "bytes",
                "bytes_records",
                "column",
                "columns",
                "comment_lines",
                "empty_lines",
                "error",
                "header",
                "index",
                "invalid_field_length",
                "lines",
                "quoting",
                "raw",
                "records",
              ],
            ],
          ]);
          next();
        },
      );
    });

    it("return anything, eg a string or an object", function (next) {
      parse(
        "2000-01-01,date1\n2050-11-27,date2",
        {
          cast: (value, context) => {
            if (context.index === 0) {
              return `${value}T05:00:00.000Z`;
            } else {
              return { ...context };
            }
          },
        },
        (err, records) => {
          if (err) return next(err);
          records.should.eql([
            [
              "2000-01-01T05:00:00.000Z",
              {
                bytes: 16,
                bytes_records: 0,
                column: 1,
                columns: false,
                comment_lines: 0,
                empty_lines: 0,
                error: undefined,
                header: false,
                index: 1,
                invalid_field_length: 0,
                lines: 1,
                quoting: false,
                raw: undefined,
                records: 0,
              },
            ],
            [
              "2050-11-27T05:00:00.000Z",
              {
                bytes: 33,
                bytes_records: 17,
                column: 1,
                columns: false,
                comment_lines: 0,
                empty_lines: 0,
                error: undefined,
                header: false,
                index: 1,
                invalid_field_length: 0,
                lines: 2,
                quoting: false,
                raw: undefined,
                records: 1,
              },
            ],
          ]);
          next();
        },
      );
    });

    it("column is a string", function (next) {
      parse(
        "1,2\n3,4,5\n6",
        {
          columns: ["a", "b"],
          relax_column_count: true,
          cast: (value, { column }) => typeof column,
        },
        (err, records) => {
          if (err) return next(err);
          records.should.eql([
            { a: "string", b: "string" },
            { a: "string", b: "string" },
            { a: "string" },
          ]);
          next();
        },
      );
    });

    it("dont call cast on unreferenced columns", function (next) {
      parse(
        "1,2\n3,4,5,6\n7",
        {
          columns: ["a", "b"],
          relax_column_count: true,
          cast: (value) => {
            const valueInt = parseInt(value);
            if (valueInt > 4 && valueInt < 7) throw Error("Oh no");
          },
        },
        (err) => {
          next(err);
        },
      );
    });

    it("custom function with quoting context", function (next) {
      parse(
        '"2000-01-01",date1\n2025-12-31,"date2"\n2050-11-27,"date3"',
        {
          cast: (value, { quoting }) => quoting,
        },
        (err, records) => {
          if (err) return next(err);
          records.should.eql([
            [true, false],
            [false, true],
            [false, true],
          ]);
          next();
        },
      );
    });

    it("accept all values", function (next) {
      parse(
        "1,2,3\n4,5,6",
        {
          max_record_size: 10,
          cast: (value, { index }) => {
            switch (index) {
              case 0:
                return undefined;
              case 1:
                return false;
              case 2:
                return null;
            }
          },
        },
        (err, records) => {
          records.shift()?.should.eql([undefined, false, null]);
          next(err);
        },
      );
    });
  });

  describe("columns", function () {
    it("header is true on first line when columns is true", function (next) {
      parse(
        "a,b,c\n1,2,3\n4,5,6",
        {
          columns: true,
          cast: (value, { header }) => (header ? value : parseInt(value)),
        },
        (err, records) => {
          if (err) return next(err);
          records.should.eql([
            { a: 1, b: 2, c: 3 },
            { a: 4, b: 5, c: 6 },
          ]);
          next();
        },
      );
    });

    it("header is false when columns is an object", function (next) {
      parse(
        "1,2,3\n4,5,6",
        {
          columns: ["a", "b", "c"],
          cast: (value, { header }) => {
            header.should.be.false();
            return parseInt(value);
          },
        },
        (err, records) => {
          if (err) return next(err);
          records.should.eql([
            { a: 1, b: 2, c: 3 },
            { a: 4, b: 5, c: 6 },
          ]);
          next();
        },
      );
    });

    it("dont count header line", function (next) {
      parse(
        "a,b,c\n1,2,3\n4,5,6",
        {
          columns: true,
          cast: (value) => value,
        },
        (err) => {
          next(err);
        },
      );
    });

    it("filter columns if value is undefined", function (next) {
      parse(
        "a,b,c,d\n1,2,3,4\n5,6,7,8",
        {
          columns: true,
          cast: (value, context) => {
            switch (context.index) {
              case 0:
                return context.header ? value : Number(value);
              case 2:
                return value;
              default:
                return undefined;
            }
          },
        },
        (err, records) => {
          if (err) return next(err);
          records.should.eql([
            { a: 1, c: "3" },
            { a: 5, c: "7" },
          ]);
          next();
        },
      );
    });

    it("throw error if header is invalid", function (next) {
      parse(
        "a,b,c,d\n1,2,3,4\n5,6,7,8",
        {
          columns: true,
          cast: (value, context) => {
            switch (context.index) {
              case 0:
                return context.header ? "string" : value;
              case 1:
                return context.header ? undefined : value;
              case 2:
                return context.header ? null : value;
              case 3:
                return context.header ? 1234 : value;
            }
          },
        },
        (err) => {
          if (!err) return next(Error("Invalid assessment"));
          assert_error(err, {
            message:
              "Invalid column definition: expect a string or a literal object, got 1234 at position 3",
            code: "CSV_INVALID_COLUMN_DEFINITION",
          });
          next();
        },
      );
    });
  });

  describe("group_columns_by_name", function () {
    it("leading zeros are maintained when group_columns_by_name is true", function (next) {
      parse(
        "FIELD_1,FIELD_1,FIELD_1\n0,2,3\n0,0,4",
        {
          cast: true,
          columns: true,
          group_columns_by_name: true,
        },
        (err, records) => {
          if (err) return next(err);
          records.should.eql([{ FIELD_1: [0, 2, 3] }, { FIELD_1: [0, 0, 4] }]);
          next();
        },
      );
    });
  });

  describe("error", function () {
    it("catch error", function (next) {
      parse(
        "1,2,3\n4,5,6",
        {
          cast: (value) => {
            if (value === "6") throw Error("Catchme");
            return value;
          },
        },
        (err) => {
          if (!err) return next(Error("Invalid assessment"));
          err.message.should.eql("Catchme");
          next();
        },
      );
    });
  });
});
