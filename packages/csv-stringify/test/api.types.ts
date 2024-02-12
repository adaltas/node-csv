import "should";
import {
  stringify,
  CastingContext,
  Options,
  Stringifier,
} from "../lib/index.js";

describe("API Types", function () {
  describe("Parser", function () {
    it("Expose options", function () {
      const stringifier: Stringifier = stringify();
      const options: Options = stringifier.options;
      const keys = Object.keys(options);
      keys
        .sort()
        .should.eql([
          "bom",
          "cast",
          "columns",
          "delimiter",
          "eof",
          "escape",
          "escape_formulas",
          "header",
          "header_as_comment",
          "on_record",
          "quote",
          "quoted",
          "quoted_empty",
          "quoted_match",
          "quoted_string",
          "record_delimiter",
        ]);
    });

    it("Receive Callback", function (next) {
      stringify(
        [["a"], ["b"]],
        function (err: Error | undefined, output: string) {
          if (err !== undefined) {
            output.should.eql("a\nb");
          }
          next(err);
        },
      );
    });
  });

  describe("Options", function () {
    it("bom", function () {
      const options: Options = {};
      options.bom = true;
    });

    it("cast", function () {
      const options: Options = {};
      options.cast = {
        boolean: (value: boolean) => {
          return value ? "true" : "false";
        },
        date: (value: Date) => {
          return value ? "true" : "false";
        },
        number: (value: number) => {
          return value ? "true" : "false";
        },
        bigint: (value: bigint) => {
          return value ? "true" : "false";
        },
        object: (value: object) => {
          return value ? "true" : "false";
        },
        string: (value: string) => {
          return value ? "true" : "false";
        },
      };
    });

    it("columns", function () {
      const options: Options = {};
      options.columns = ["b", "a"];
      options.columns = [{ key: "b" }, { key: "a" }];
      options.columns = [
        { key: "b", header: "B" },
        { key: "a", header: "A" },
        "c",
        { key: "d" },
      ];
      options.columns = {
        field1: "column1",
        field3: "column3",
      };
    });

    it("columns as const", function () {
      const options: Options = {};
      options.columns = ["b", "a"];
      options.columns = ["b", "a"] as const;
    });

    it("delimiter", function () {
      const options: Options = {};
      options.delimiter = ":";
      options.delimiter = Buffer.from(":");
    });

    it("escape", function () {
      const options: Options = {};
      options.escape = '"';
      options.escape = Buffer.from('"');
    });

    it("escape_formulas", function () {
      const options: Options = {};
      options.escape_formulas = true;
    });

    it("header", function () {
      const options: Options = {};
      options.header = true;
    });

    it("quote", function () {
      const options: Options = {};
      options.quote = '"';
      options.quote = Buffer.from('"');
      options.quote = true;
      options.quote = false;
    });

    it("quoted", function () {
      const options: Options = {};
      options.quoted = true;
      options.quoted = false;
    });

    it("quoted_empty", function () {
      const options: Options = {};
      options.quoted_empty = true;
      options.quoted_empty = false;
    });

    it("quoted_match", function () {
      const options: Options = {};
      options.quoted_match = '"';
      options.quoted_match = /"/;
      options.quoted_match = ['"', /"/];
    });

    it("quoted_string", function () {
      const options: Options = {};
      options.quoted_string = true;
      options.quoted_string = false;
    });

    it("record_delimiter", function () {
      const options: Options = {};
      options.record_delimiter = "|";
      options.record_delimiter = Buffer.from("|");
    });
  });

  describe("CastingContext", function () {
    it("all properties", function () {
      (context: CastingContext) => {
        const column: number | string | undefined = context.column;
        const header: boolean = context.header;
        const index: number = context.index;
        const records: number = context.records;
        return [column, header, index, records];
      };
    });
  });
});
