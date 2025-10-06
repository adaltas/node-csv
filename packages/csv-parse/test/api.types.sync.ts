import "should";
import { parse, CsvError } from "../lib/sync.js";
import type {
  InfoField,
  CastingFunction,
  CastingDateFunction,
  ColumnOption,
  Options,
  Info,
  CsvErrorCode,
} from "../lib/sync.js";

describe("API Types", function () {
  type Person = { name: string; age: number };

  it("respect parse signature", function () {
    // No argument
    parse("");
    parse("", {});
    parse(Buffer.from(""));
    parse(Buffer.from(""), {});
  });

  it("return records", function () {
    try {
      const records = parse("");
      typeof records;
    } catch (err) {
      if (err instanceof CsvError) {
        err.message;
      }
    }
  });

  it("Options", function () {
    (options: Options) => {
      const bom: boolean | undefined = options.bom;
      return [bom];
    };
  });

  it("InfoField", function () {
    const options: Options = {
      cast: (value: string, context: InfoField) => {
        return `${value} ${context.index}`;
      },
    };
    return options;
  });

  it("CastingDateFunction", function () {
    const castDate: CastingDateFunction = (
      value: string,
      context: InfoField,
    ) => {
      return new Date(`${value} ${context.index}`);
    };
    const options: Options = {
      cast_date: castDate,
    };
    return options;
  });

  it("CastingFunction", function () {
    const cast: CastingFunction = (value: string, context: InfoField) => {
      return `${value} ${context.index}`;
    };
    const options: Options = {
      cast: cast,
    };
    return options;
  });

  it("ColumnOption", function () {
    const column: ColumnOption = { name: "sth" };
    const options: Options = {
      columns: [column],
    };
    return options;
  });

  it("CsvErrorCode", function () {
    const err = new CsvError("CSV_RECORD_INCONSISTENT_FIELDS_LENGTH", "error");
    const code: CsvErrorCode = err.code;
    return code;
  });

  it("Info", function () {
    const info: Info = {
      bytes: 1,
      bytes_records: 0,
      // columns: true,
      comment_lines: 1,
      empty_lines: 1,
      invalid_field_length: 1,
      lines: 1,
      records: 1,
    };
    return info;
  });

  describe("Generic types", function () {
    it("Exposes string[][] if columns is not specified", function () {
      const data: string[][] = parse("", {});
      data;
    });

    it("Exposes string[][] if columns is falsy", function () {
      const data: string[][] = parse("", {
        columns: false,
      });
      data;
    });

    it("Exposes unknown[] if columns is specified as boolean", function () {
      const data: unknown[] = parse("", {
        columns: true,
      });
      data;
    });

    it("Exposes T[] if columns is specified", function () {
      const data: Person[] = parse<Person>("", {
        columns: true,
      });
      data;
    });
  });
});
