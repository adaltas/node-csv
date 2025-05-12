import should from "should";
import { parse } from "../lib/index.js";

describe("Option `on_record`", function () {
  it("validate", function () {
    (() => {
      parse({ on_record: true });
    }).should.throw({
      message: "Invalid option `on_record`: expect a function, got true",
      code: "CSV_INVALID_OPTION_ON_RECORD",
    });
  });

  describe("usage", function () {
    it("alter records", function (next) {
      parse(
        "a,b",
        {
          on_record: (record) => {
            return [record[1], record[0]];
          },
        },
        (err, records) => {
          if (!err) {
            records.should.eql([["b", "a"]]);
          }
          next(err);
        },
      );
    });

    it("filter records", function (next) {
      parse(
        "a,b\nc,d\ne,f",
        {
          on_record: (record, { lines }) => {
            if (lines === 2) return null;
            else return record;
          },
        },
        (err, records) => {
          if (!err) {
            records.should.eql([
              ["a", "b"],
              ["e", "f"],
            ]);
          }
          next(err);
        },
      );
    });

    it("errors with callback", function (next) {
      parse(
        "a,b\nc,d\ne,f",
        {
          on_record: (record, { lines }) => {
            if (lines === 2) throw Error("Error thrown on line 2");
            else return record;
          },
        },
        (err) => {
          err.message.should.eql("Error thrown on line 2");
          next();
        },
      );
    });

    it("errors with events", function (next) {
      const parser = parse("a,a,a\nc,d\ne,f");
      parser.on("error", (err) => {
        err.message.should.eql(
          "Invalid Record Length: expect 3, got 2 on line 2",
        );
        next();
      });
      parser.on("end", () => {
        next(Error("Should not be called"));
      });
    });

    it("errors not handled by skip_records_with_error", function (next) {
      parse(
        "a,b\nc,d\ne,f",
        {
          on_record: (record, { lines }) => {
            if (lines === 2) throw Error("Error thrown on line 2");
            else return record;
          },
          skip_records_with_error: true,
        },
        (err) => {
          err.message.should.eql("Error thrown on line 2");
          next();
        },
      );
    });
  });

  describe("context", function () {
    it("properties", function (next) {
      parse(
        "a,b",
        {
          on_record: (record, context) => {
            should(context.raw).be.undefined();
            return Object.keys(context).sort();
          },
          skip_records_with_error: true,
        },
        (err, records) => {
          records.should.eql([
            [
              "bytes",
              "columns",
              "comment_lines",
              "empty_lines",
              "error",
              "header",
              "index",
              "invalid_field_length",
              "lines",
              "raw",
              "records",
            ],
          ]);
          next();
        },
      );
    });

    it("properties with `columns: true` and `raw: true`", function (next) {
      parse(
        "a,b\n1,2\n3,4",
        {
          columns: true,
          raw: true,
          on_record: (record, context) => {
            if (context.lines === 2) {
              context.raw.should.eql("1,2\n");
            } else if (context.lines === 3) {
              context.raw.should.eql("3,4");
            }
            return Object.keys(context).sort();
          },
          skip_records_with_error: true,
        },
        (err, records) => {
          records
            .shift()
            .should.eql([
              "bytes",
              "columns",
              "comment_lines",
              "empty_lines",
              "error",
              "header",
              "index",
              "invalid_field_length",
              "lines",
              "raw",
              "records",
            ]);
          next();
        },
      );
    });

    it("values", function (next) {
      parse(
        "a,b\nc,d",
        {
          on_record: (record, context) => {
            return context;
          },
          skip_records_with_error: true,
        },
        (err, records) => {
          records.should.eql([
            {
              bytes: 4,
              columns: false,
              comment_lines: 0,
              empty_lines: 0,
              error: undefined,
              header: false,
              index: 2,
              invalid_field_length: 0,
              lines: 1,
              raw: undefined,
              records: 1,
            },
            {
              bytes: 7,
              columns: false,
              comment_lines: 0,
              empty_lines: 0,
              error: undefined,
              header: false,
              index: 2,
              invalid_field_length: 0,
              lines: 2,
              raw: undefined,
              records: 2,
            },
          ]);
          next();
        },
      );
    });
  });
});
