import should from "should";
import { parse, InfoRecord } from "../lib/index.js";

describe("Option `on_record`", function () {
  describe("usage", function () {
    it("alter records", function (next) {
      parse(
        "a,b",
        {
          on_record: (record) => {
            console.log(record[1]);
            return [record[1], record[0]];
          },
        },
        (err, records) => {
          if (err) return next(err);
          records.should.eql([["b", "a"]]);
          next();
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
          if (err) return next(err);
          records.should.eql([
            ["a", "b"],
            ["e", "f"],
          ]);
          next();
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
          if (!err) return next("Invalid assertion");
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
          if (!err) return next("Invalid assertion");
          err.message.should.eql("Error thrown on line 2");
          next();
        },
      );
    });

    it("with option `columns` (fix #461 #464 #466)", function (next) {
      type RowTypeOriginal = { a: string; b: string };
      type RowTypeFinal = { prop_a: string; prop_b: string };
      parse<RowTypeFinal, RowTypeOriginal>(
        "a,1\nb,2",
        {
          on_record: (record: RowTypeOriginal): RowTypeFinal => ({
            prop_a: record.a,
            prop_b: record.b,
          }),
          columns: ["a", "b"],
        },
        function (err, records: RowTypeFinal[]) {
          records.should.eql([
            {
              prop_a: "a",
              prop_b: "1",
            },
            {
              prop_a: "b",
              prop_b: "2",
            },
          ]);
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
              "bytes_records",
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
              context.raw?.should.eql("1,2\n");
            } else if (context.lines === 3) {
              context.raw?.should.eql("3,4");
            }
            return Object.keys(context).sort();
          },
          skip_records_with_error: true,
        },
        (err, records) => {
          if (err) return next(err);
          (records as unknown[] as { record: string; raw: string }[])
            .shift()
            ?.should.eql([
              "bytes",
              "bytes_records",
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
      parse<InfoRecord>(
        "a,b\n1,2\n3,4",
        {
          on_record: (record, context) => {
            record;
            return context;
          },
          columns: true, // todo, required to satisfy TS type
          skip_records_with_error: true,
        },
        (err, records) => {
          records.should.eql([
            {
              bytes: 8,
              bytes_records: 8,
              columns: [{ name: "a" }, { name: "b" }],
              comment_lines: 0,
              empty_lines: 0,
              error: undefined,
              header: false,
              index: 2,
              invalid_field_length: 0,
              lines: 2,
              raw: undefined,
              records: 1,
            },
            {
              bytes: 11,
              bytes_records: 11,
              columns: [{ name: "a" }, { name: "b" }],
              comment_lines: 0,
              empty_lines: 0,
              error: undefined,
              header: false,
              index: 2,
              invalid_field_length: 0,
              lines: 3,
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
