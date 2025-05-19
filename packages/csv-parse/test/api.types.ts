import "should";
import {
  parse,
  CastingContext,
  Info,
  Options,
  Parser,
  CsvError,
} from "../lib/index.js";
import { parse as parse_sync } from "../lib/sync.js";

describe("API Types", function () {
  type Person = { name: string; age: number };

  describe("stream/callback API", function () {
    it("respect parse signature", function () {
      // No argument
      parse();
      parse("");
      parse("", () => {});
      parse("", {});
      parse("", {}, () => {});
      parse(Buffer.from(""));
      parse(Buffer.from(""), () => {});
      parse(Buffer.from(""), {});
      parse(Buffer.from(""), {}, () => {});
      parse(() => {});
      parse({});
      parse({}, () => {});
    });

    it("Expose options", function () {
      const parser: Parser = parse();
      const options: Options = parser.options;
      const keys: string[] = Object.keys(options);
      keys
        .sort()
        .should.eql([
          "bom",
          "cast",
          "cast_date",
          "cast_first_line_to_header",
          "cast_function",
          "columns",
          "comment",
          "comment_no_infix",
          "delimiter",
          "encoding",
          "escape",
          "from",
          "from_line",
          "group_columns_by_name",
          "ignore_last_delimiters",
          "info",
          "ltrim",
          "max_record_size",
          "objname",
          "on_record",
          "on_skip",
          "quote",
          "raw",
          "record_delimiter",
          "relax_column_count",
          "relax_column_count_less",
          "relax_column_count_more",
          "relax_quotes",
          "rtrim",
          "skip_empty_lines",
          "skip_records_with_empty_values",
          "skip_records_with_error",
          "to",
          "to_line",
          "trim",
        ]);
    });

    it("Expose info", function () {
      const parser: Parser = parse();
      const info: Info = parser.info;
      const keys: string[] = Object.keys(info);
      keys
        .sort()
        .should.eql([
          "bytes",
          "comment_lines",
          "empty_lines",
          "invalid_field_length",
          "lines",
          "records",
        ]);
    });

    it("Receive Callback", function (next) {
      parse("a\nb", function (err, records, info) {
        if (err !== undefined) {
          records!.should.eql([["a"], ["b"]]);
          info!.records.should.eql(2);
        }
        next(err);
      });
    });
  });

  describe("Info", function () {
    const fakeinfo = {
      bytes: 1,
      columns: true,
      comment_lines: 1,
      empty_lines: 1,
      invalid_field_length: 1,
      lines: 1,
      records: 1,
    };

    it("bytes", function () {
      const info: Info = fakeinfo;
      const bytes: number = info.bytes;
      bytes;
    });

    it("comment_lines", function () {
      const info: Info = fakeinfo;
      const comment_lines: number = info.comment_lines;
      comment_lines;
    });

    it("empty_lines", function () {
      const info: Info = fakeinfo;
      const empty_lines: number = info.empty_lines;
      empty_lines;
    });

    it("lines", function () {
      const info: Info = fakeinfo;
      const lines: number = info.lines;
      lines;
    });

    it("records", function () {
      const info: Info = fakeinfo;
      const records: number = info.records;
      records;
    });

    it("invalid_field_length", function () {
      const info: Info = fakeinfo;
      const invalid_field_length: number = info.invalid_field_length;
      invalid_field_length;
    });

    it("columns may be a boolean or an array", function () {
      // Boolean
      const infoBoolean: Info = {
        bytes: 1,
        columns: true,
        comment_lines: 1,
        empty_lines: 1,
        invalid_field_length: 1,
        lines: 1,
        records: 1,
      };
      infoBoolean;
      // Array with name = <string>
      const infoName: Info = {
        bytes: 1,
        columns: [{ name: "a column" }],
        comment_lines: 1,
        empty_lines: 1,
        invalid_field_length: 1,
        lines: 1,
        records: 1,
      };
      infoName;
      // Array with disabled = true
      const infoDisabled: Info = {
        bytes: 1,
        columns: [{ disabled: true }],
        comment_lines: 1,
        empty_lines: 1,
        invalid_field_length: 1,
        lines: 1,
        records: 1,
      };
      infoDisabled;
    });
  });

  describe("Options", function () {
    it("cast", function () {
      const options: Options = {};
      options.cast = true;
      options.cast = () => {};
    });

    it("cast_date", function () {
      const options: Options = {};
      options.cast_date = true;
      options.castDate = true;
      options.cast_date = (value: string, context: CastingContext) => {
        return new Date(`${value} ${context.index}`);
      };
    });

    it("columns", function () {
      const options: Options = {};
      options.columns = true;
      options.columns = [];
      options.columns = [
        "string",
        undefined,
        null,
        false,
        { name: "column-name" },
      ];
      options.columns = (record) => {
        const fields = record.map((field: string) => {
          return field.toUpperCase();
        });
        return fields;
      };
      options.columns = (record) => {
        record;
        return ["string", undefined, null, false, { name: "column-name" }];
      };

      const typedOptions: Options<Person> = {};
      typedOptions.columns = ["age", undefined, null, false, { name: "name" }];
      typedOptions.columns = (record) => {
        return ["age"];
      };

      const unknownTypedOptions: Options<unknown> = {};
      unknownTypedOptions.columns = ["anything", undefined, null, false];
      unknownTypedOptions.columns = (record) => {
        return ["anything", undefined, null, false];
      };
    });

    it("group_columns_by_name", function () {
      const options: Options = {};
      options.group_columns_by_name = true;
      options.groupColumnsByName = true;
    });

    it("comment", function () {
      const options: Options = {};
      options.comment = "\\";
    });

    it("delimiter", function () {
      const options: Options = {};
      options.delimiter = ":";
      options.delimiter = [":", ")"];
      options.delimiter = Buffer.from(":");
    });

    it("escape", function () {
      const options: Options = {};
      options.escape = ":";
      options.escape = Buffer.from('"');
    });

    it("from", function () {
      const options: Options = {};
      options.from = 10;
    });

    it("from_line", function () {
      const options: Options = {};
      options.from_line = 10;
      options.fromLine = 10;
    });

    it("ignore_last_delimiters", function () {
      const options: Options = {};
      options.ignore_last_delimiters = true;
      options.ignore_last_delimiters = 1;
    });

    it("info", function () {
      const options: Options = {};
      options.info = true;
    });

    it("ltrim", function () {
      const options: Options = {};
      options.ltrim = true;
    });

    it("max_record_size", function () {
      const options: Options = {};
      options.max_record_size = 100;
      options.maxRecordSize = 100;
    });

    it("objname", function () {
      const options: Options = {};
      options.objname = "name";
    });

    it("on_record", function () {
      const options: Options = {};
      options.on_record = (record, { lines }) => [lines.toString(), record[0]];
      options.onRecord = (record, { lines }) => [lines.toString(), record[0]];
    });

    it("quote", function () {
      const options: Options = {};
      options.quote = '"';
      options.quote = true;
      options.quote = Buffer.from('"');
      options.quote = null;
    });

    it("raw", function () {
      const options: Options = {};
      options.raw = true;
    });

    it("relax_column_count", function () {
      const options: Options = {};
      options.relax_column_count = true;
      options.relaxColumnCount = true;
      options.relax_column_count_less = true;
      options.relaxColumnCountLess = true;
      options.relax_column_count_more = true;
      options.relaxColumnCountMore = true;
    });

    it("relax_quotes", function () {
      const options: Options = {};
      options.relax_quotes = true;
      options.relaxQuotes = true;
    });

    it("record_delimiter", function () {
      const options: Options = {};
      options.record_delimiter = "\n";
      options.record_delimiter = ["\n"];
      options.record_delimiter = Buffer.from("\n");
      options.record_delimiter = [Buffer.from("\n")];
      options.recordDelimiter = "\n";
    });

    it("rtrim", function () {
      const options: Options = {};
      options.rtrim = true;
    });

    it("skip_empty_lines", function () {
      const options: Options = {};
      options.skip_empty_lines = true;
      options.skipEmptyLines = true;
    });

    it("skip_records_with_empty_values", function () {
      const options: Options = {};
      options.skip_records_with_empty_values = true;
      options.skipRecordsWithEmptyValues = true;
    });

    it("skip_records_with_error", function () {
      const options: Options = {};
      options.skip_records_with_error = true;
      options.skipRecordsWithError = true;
    });

    it("to", function () {
      const options: Options = {};
      options.to = 10;
    });

    it("to_line", function () {
      const options: Options = {};
      options.to_line = 10;
      options.toLine = 10;
    });

    it("trim", function () {
      const options: Options = {};
      options.trim = true;
    });
  });

  describe("CastingContext", function () {
    it("all properties", function () {
      (context: CastingContext) => {
        const column: number | string = context.column;
        const empty_lines: number = context.empty_lines;
        const header: boolean = context.header;
        const index: number = context.index;
        const quoting: boolean = context.quoting;
        const lines: number = context.lines;
        const records: number = context.records;
        const invalid_field_length: number = context.invalid_field_length;
        return [
          column,
          empty_lines,
          header,
          index,
          quoting,
          lines,
          records,
          invalid_field_length,
        ];
      };
    });
  });

  describe("CsvError", function () {
    describe("Typescript definition is accurate", function () {
      it("Minimum", function () {
        const error = new CsvError(
          "CSV_RECORD_INCONSISTENT_FIELDS_LENGTH",
          "MESSAGE",
        );

        error.code.should.eql("CSV_RECORD_INCONSISTENT_FIELDS_LENGTH");
        error.message.should.eql("MESSAGE");
      });

      it("Multiple messages", function () {
        const error = new CsvError("CSV_RECORD_INCONSISTENT_FIELDS_LENGTH", [
          "MESSAGE1",
          "MESSAGE2",
        ]);

        error.code.should.eql("CSV_RECORD_INCONSISTENT_FIELDS_LENGTH");
        error.message.should.eql("MESSAGE1 MESSAGE2");
      });

      it("Supports contexts", function () {
        const error = new CsvError(
          "CSV_RECORD_INCONSISTENT_FIELDS_LENGTH",
          "MESSAGE",
          {},
          { testContext: { testProp: "testValue" } },
        );

        error.code.should.eql("CSV_RECORD_INCONSISTENT_FIELDS_LENGTH");
        error.message.should.eql("MESSAGE");
        error.should.have.key("testContext").and.eql({ testProp: "testValue" });
      });
    });

    it("Proper type is thrown when an error is encountered", function () {
      parse(`a,b\nc`, function (e: Error | undefined) {
        const isCsvError = e instanceof CsvError;
        isCsvError.should.be.true();
        (e as CsvError).code.should.eql(
          "CSV_RECORD_INCONSISTENT_FIELDS_LENGTH",
        );
      });
    });
  });

  describe("Generic types", function () {
    it("Exposes string[][] if columns is not specified", function (next) {
      parse("", {}, (error, records: string[][] | undefined) => {
        next(error);
      });
    });

    it("Exposes string[][] if columns is falsy", function (next) {
      parse(
        "",
        {
          columns: false,
        },
        (error, records: string[][] | undefined) => {
          next(error);
        },
      );
    });

    it("Exposes unknown[] if columns is specified as boolean", function (next) {
      parse(
        "",
        {
          columns: true,
        },
        (error, records: unknown[] | undefined) => {
          next(error);
        },
      );
    });

    it("Exposes T[] if columns is specified", function (next) {
      parse<Person>(
        "",
        {
          columns: true,
        },
        (error, records: Person[] | undefined) => {
          next(error);
        },
      );
    });
  });
});
