import "should";
import { parse } from "../lib/index.js";

describe("Option `delimiter`", function () {
  it("validation", function () {
    parse("", { delimiter: "," }, () => {});
    parse("", { delimiter: Buffer.from(",") }, () => {});
    (() => {
      parse("", { delimiter: "" }, () => {});
    }).should.throw({
      message:
        'Invalid option delimiter: delimiter must be a non empty string or buffer or array of string|buffer, got ""',
      code: "CSV_INVALID_OPTION_DELIMITER",
    });
    (() => {
      parse("", { delimiter: Buffer.from("") }, () => {});
    }).should.throw({
      message:
        'Invalid option delimiter: delimiter must be a non empty string or buffer or array of string|buffer, got {"type":"Buffer","data":[]}',
      code: "CSV_INVALID_OPTION_DELIMITER",
    });
    (() => {
      parse("", { delimiter: true }, () => {});
    }).should.throw({
      message:
        "Invalid option delimiter: delimiter must be a non empty string or buffer or array of string|buffer, got true",
      code: "CSV_INVALID_OPTION_DELIMITER",
    });
    (() => {
      parse("", { delimiter: [] }, () => {});
    }).should.throw({
      message:
        "Invalid option delimiter: delimiter must be a non empty string or buffer or array of string|buffer, got []",
      code: "CSV_INVALID_OPTION_DELIMITER",
    });
    (() => {
      parse("", { delimiter: [""] }, () => {});
    }).should.throw({
      message:
        'Invalid option delimiter: delimiter must be a non empty string or buffer or array of string|buffer, got [""]',
      code: "CSV_INVALID_OPTION_DELIMITER",
    });
    (() => {
      parse("", { delimiter: [",", ""] }, () => {});
    }).should.throw({
      message:
        'Invalid option delimiter: delimiter must be a non empty string or buffer or array of string|buffer, got [",",""]',
      code: "CSV_INVALID_OPTION_DELIMITER",
    });
  });

  it("is compatible with buffer size", function (next) {
    const parser = parse({ delimiter: [":::"] }, (err, records) => {
      records.should.eql([
        ["1", "2", "3"],
        ["b", "c", "d"],
      ]);
      next(err);
    });
    for (const c of "1:::2:::3\nb:::c:::d") {
      parser.write(c);
    }
    parser.end();
  });

  it("using default comma", function (next) {
    parse("abc,,123,\n,def,,", (err, records) => {
      if (err) return next(err);
      records.should.eql([
        ["abc", "", "123", ""],
        ["", "def", "", ""],
      ]);
      next();
    });
  });

  it("using tab", function (next) {
    parse(
      "abc\t\tde\tf\t\n\thij\tklm\t\t",
      {
        delimiter: "\t",
      },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["abc", "", "de", "f", ""],
          ["", "hij", "klm", "", ""],
        ]);
        next();
      },
    );
  });

  it("multiple chars empty fields only", function (next) {
    parse(
      "!#\n!#",
      {
        delimiter: "!#",
      },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["", ""],
          ["", ""],
        ]);
        next();
      },
    );
  });

  it("multiple chars mixed fields", function (next) {
    parse(
      "20322051544!#!#8.8017226E7!#45!#\n!#1974!#8.8392926E7!#!#",
      {
        delimiter: "!#",
      },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["20322051544", "", "8.8017226E7", "45", ""],
          ["", "1974", "8.8392926E7", "", ""],
        ]);
        next();
      },
    );
  });

  it("using array of a single delimiter", function (next) {
    parse(
      "abc,,123,\n,def,,",
      {
        delimiter: [","],
      },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["abc", "", "123", ""],
          ["", "def", "", ""],
        ]);
        next();
      },
    );
  });

  it("using array of a single delimiter of multiple characters", function (next) {
    parse(
      "!#\n!#",
      {
        delimiter: ["!#"],
      },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["", ""],
          ["", ""],
        ]);
        next();
      },
    );
  });

  it("using array of a multiple delimiters of variable length", function (next) {
    parse(
      "abc,;;123;;\n;;def;;,",
      {
        delimiter: [",", ";;"],
      },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["abc", "", "123", ""],
          ["", "def", "", ""],
        ]);
        next();
      },
    );
  });
});
