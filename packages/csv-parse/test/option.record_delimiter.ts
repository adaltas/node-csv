import "should";
import { parse } from "../lib/index.js";

describe("Option `record_delimiter`", function () {
  describe("validation", function () {
    it("accepted types", function () {
      parse("a,b,c", { record_delimiter: undefined }, () => {});
      parse("a,b,c", { record_delimiter: "string" }, () => {});
      parse("a,b,c", { record_delimiter: ["string"] }, () => {});
      parse("a,b,c", { record_delimiter: Buffer.from("string") }, () => {});
      parse("a,b,c", { record_delimiter: [Buffer.from("string")] }, () => {});
    });

    it("non accepted types", function () {
      (() => {
        parse("a,b,c", { record_delimiter: "" }, () => {});
      }).should.throw({
        message: [
          "Invalid option `record_delimiter`:",
          "value must be a non empty string or buffer,",
          'got ""',
        ].join(" "),
        code: "CSV_INVALID_OPTION_RECORD_DELIMITER",
      });
      (() => {
        parse("a,b,c", { record_delimiter: Buffer.from("") }, () => {});
      }).should.throw({
        message: [
          "Invalid option `record_delimiter`:",
          "value must be a non empty string or buffer,",
          'got {"type":"Buffer","data":[]}',
        ].join(" "),
        code: "CSV_INVALID_OPTION_RECORD_DELIMITER",
      });
      (() => {
        parse("a,b,c", { record_delimiter: null }, () => {});
      }).should.throw({
        message: [
          "Invalid option `record_delimiter`:",
          "value must be a string, a buffer or array of string|buffer,",
          "got null",
        ].join(" "),
        code: "CSV_INVALID_OPTION_RECORD_DELIMITER",
      });
      (() => {
        parse("a,b,c", { record_delimiter: ["a", "", "b"] }, () => {});
      }).should.throw({
        message: [
          "Invalid option `record_delimiter`:",
          "value must be a non empty string or buffer",
          "at index 1,",
          'got ""',
        ].join(" "),
        code: "CSV_INVALID_OPTION_RECORD_DELIMITER",
      });
      (() => {
        parse("a,b,c", { record_delimiter: ["a", null, "b"] }, () => {});
      }).should.throw({
        message: [
          "Invalid option `record_delimiter`:",
          "value must be a string, a buffer or array of string|buffer",
          "at index 1,",
          "got null",
        ].join(" "),
        code: "CSV_INVALID_OPTION_RECORD_DELIMITER",
      });
    });
  });

  describe("usage", function () {
    it("as a string", function (next) {
      parse("ABC,45::DEF,23", { record_delimiter: "::" }, (err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["ABC", "45"],
          ["DEF", "23"],
        ]);
        next();
      });
    });

    it("as an array", function (next) {
      parse(
        "ABC,45::DEF,23\n50,60",
        { record_delimiter: ["::", "\n"] },
        (err, records) => {
          if (err) return next(err);
          records.should.eql([
            ["ABC", "45"],
            ["DEF", "23"],
            ["50", "60"],
          ]);
          next();
        },
      );
    });
  });

  describe("details", function () {
    it("is compatible with buffer size", function (next) {
      const parser = parse({ record_delimiter: ["::::::"] }, (err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["1", "2", "3"],
          ["b", "c", "d"],
        ]);
        next();
      });
      for (const c of "1,2,3::::::b,c,d") {
        parser.write(c);
      }
      parser.end();
    });

    it("ensure that delimiter and record_delimiter doesnt match", function (next) {
      parse(
        "a;b\n11;22;\n33;33;\n",
        {
          delimiter: ";",
          record_delimiter: [";\n", "\n"],
        },
        (err, records) => {
          if (err) return next(err);
          records.should.eql([
            ["a", "b"],
            ["11", "22"],
            ["33", "33"],
          ]);
          next();
        },
      );
    });

    it("handle new line preceded by a quote when record_delimiter is a string", function (next) {
      parse(
        '"ABC","45"::"DEF","23"::"GHI","94"',
        { record_delimiter: "::" },
        (err, records) => {
          if (err) return next(err);
          records.should.eql([
            ["ABC", "45"],
            ["DEF", "23"],
            ["GHI", "94"],
          ]);
          next();
        },
      );
    });

    it("handle new line preceded by a quote when record_delimiter is an array", function (next) {
      parse(
        '"ABC","45"::"DEF","23"::"GHI","94"\r\n"JKL","13"',
        { record_delimiter: ["::", "\r\n"] },
        (err, records) => {
          if (err) return next(err);
          records.should.eql([
            ["ABC", "45"],
            ["DEF", "23"],
            ["GHI", "94"],
            ["JKL", "13"],
          ]);
          next();
        },
      );
    });

    it("handle chunks of multiple chars when record_delimiter is a string", function (next) {
      const records: string[] = [];
      const parser = parse({ record_delimiter: "::" });
      parser.on("readable", () => {
        let d;
        while ((d = parser.read())) {
          records.push(d);
        }
      });
      parser.on("end", () => {
        records.should.eql([
          ["ABC", "45"],
          ["DEF", "23"],
          ["GHI", "94"],
          ["JKL", "02"],
        ]);
        next();
      });
      parser.write('"ABC","45"');
      parser.write('::"DEF","23":');
      parser.write(':"GHI","94"::');
      parser.write('"JKL","02"');
      parser.end();
    });

    it("handle chunks of multiple chars when record_delimiter is an array", function (next) {
      const records: string[] = [];
      const parser = parse({ record_delimiter: ["::", "\r"] });
      parser.on("readable", () => {
        let d;
        while ((d = parser.read())) {
          records.push(d);
        }
      });
      parser.on("end", () => {
        records.should.eql([
          ["ABC", "45"],
          ["DEF", "23"],
          ["GHI", "94"],
          ["JKL", "02"],
          ["MNO", "13"],
        ]);
        next();
      });
      parser.write('"ABC","45"');
      parser.write('::"DEF","23":');
      parser.write(':"GHI","94"::');
      parser.write('"JKL","02"\r');
      parser.write('"MNO","13"');
      parser.end();
    });

    it("handle chunks of multiple chars without quotes when record_delimiter is a string", function (next) {
      const records: string[] = [];
      const parser = parse({ record_delimiter: "::" });
      parser.on("readable", () => {
        let d;
        while ((d = parser.read())) {
          records.push(d);
        }
      });
      parser.on("end", () => {
        records.should.eql([
          ["ABC", "45"],
          ["DEF", "23"],
          ["GHI", "94"],
          ["JKL", "02"],
        ]);
        next();
      });
      parser.write("ABC,45");
      parser.write("::DEF,23:");
      parser.write(":GHI,94::");
      parser.write("JKL,02");
      parser.end();
    });

    it("handle chunks of multiple chars without quotes when record_delimiter is an array", function (next) {
      const records: string[] = [];
      const parser = parse({ record_delimiter: ["::", "\n", "\r\n"] });
      parser.on("readable", () => {
        let d;
        while ((d = parser.read())) {
          records.push(d);
        }
      });
      parser.on("end", () => {
        records.should.eql([
          ["ABC", "45"],
          ["DEF", "23"],
          ["GHI", "94"],
          ["JKL", "02"],
        ]);
        next();
      });
      parser.write("ABC,45\n");
      parser.write("DEF,23:");
      parser.write(":GHI,94\r");
      parser.write("\nJKL,02");
      parser.end();
    });
  });

  describe("auto", function () {
    it("No record", function (next) {
      parse("", (err, records) => {
        if (err) return next(err);
        records.should.eql([]);
        next();
      });
    });

    it("handle chunks in autodiscovery", function (next) {
      const records: string[] = [];
      const parser = parse();
      parser.on("readable", () => {
        let d;
        while ((d = parser.read())) {
          records.push(d);
        }
      });
      parser.on("end", () => {
        records.should.eql([
          ["ABC", "45"],
          ["DEF", "23"],
          ["GHI", "94"],
          ["JKL", "02"],
        ]);
        next();
      });
      parser.write('"ABC","45"');
      parser.write('\n"DEF","23"\n');
      parser.write('"GHI","94"\n');
      parser.write('"JKL","02"');
      parser.end();
    });

    it("write aggressively", function (next) {
      const records: string[] = [];
      const parser = parse();
      parser.on("readable", () => {
        let d;
        while ((d = parser.read())) {
          records.push(d);
        }
      });
      parser.on("end", () => {
        records.should.eql([
          ["abc", "123"],
          ["def", "456"],
        ]);
        next();
      });
      parser.write("abc,123");
      parser.write("\n");
      parser.write("def,456");
      parser.end();
    });

    it("Test line ends with field delimiter and without record delimiter", function (next) {
      parse('"a","b","c",', { delimiter: "," }, (err, records) => {
        if (err) return next(err);
        records.should.eql([["a", "b", "c", ""]]);
        next();
      });
    });

    it("ensure autodiscovery support chunck between lines", function (next) {
      const records: string[] = [];
      const parser = parse();
      parser.on("readable", () => {
        let d;
        while ((d = parser.read())) {
          records.push(d);
        }
      });
      parser.on("end", () => {
        records.should.eql([
          ["ABC", "45"],
          ["DEF", "23"],
          ["GHI", "94"],
          ["JKL", "02"],
        ]);
        next();
      });
      parser.write("ABC,45");
      parser.write("\r\nDEF,23\r");
      parser.write("\nGHI,94\r\n");
      parser.write("JKL,02\r\n");
      parser.end();
    });

    it("skip default record delimiters when quoted", function (next) {
      const parser = parse((err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["1", "2", "\n"],
          ["3", "4", ""],
        ]);
        next();
      });
      for (const c of '1,2,"\n"\r\n3,4,') {
        parser.write(c);
      }
      parser.end();
    });

    it("with skip empty lines", function (next) {
      parse(
        "ABC\r\n\r\nDEF\r\n\r\n",
        { skip_empty_lines: true },
        (err, records) => {
          if (err) return next(err);
          records.should.eql([["ABC"], ["DEF"]]);
          next();
        },
      );
    });

    it("support utf8 no bom with windows line ending", function (next) {
      const parser = parse({ encoding: "utf8" }, (err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["a", "b"],
          ["1", "2"],
        ]);
        next();
      });
      const buf = Buffer.from("a,b\r\n1,2", "utf8");
      for (let i = 0; i < buf.length; i++) {
        parser.write(Buffer.from([buf[i]]));
      }
      parser.end();
    });

    it("support utf8 no bom with mac os 9 line ending", function (next) {
      const parser = parse({ encoding: "utf8" }, (err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["a", "b"],
          ["1", "2"],
        ]);
        next();
      });
      const buf = Buffer.from("a,b\r1,2", "utf8");
      for (let i = 0; i < buf.length; i++) {
        parser.write(Buffer.from([buf[i]]));
      }
      parser.end();
    });

    it("support utf8 no bom with unix line ending", function (next) {
      const parser = parse({ encoding: "utf8" }, (err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["a", "b"],
          ["1", "2"],
        ]);
        next();
      });
      const buf = Buffer.from("a,b\n1,2", "utf8");
      for (let i = 0; i < buf.length; i++) {
        parser.write(Buffer.from([buf[i]]));
      }
      parser.end();
    });

    it("support utf8 with bom with windows line ending", function (next) {
      const parser = parse({ bom: true }, (err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["a", "b"],
          ["1", "2"],
        ]);
        next();
      });
      const buf = Buffer.concat([
        Buffer.from([239, 187, 191]),
        Buffer.from("a,b\r\n1,2", "utf8"),
      ]);
      for (let i = 0; i < buf.length; i++) {
        parser.write(Buffer.from([buf[i]]));
      }
      parser.end();
    });

    it("support utf16le no bom with windows line ending", function (next) {
      const parser = parse({ encoding: "utf16le" }, (err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["a", "b"],
          ["1", "2"],
        ]);
        next();
      });
      const buf = Buffer.from("a,b\r\n1,2", "utf16le");
      for (let i = 0; i < buf.length; i++) {
        parser.write(Buffer.from([buf[i]]));
      }
      parser.end();
    });

    it("support utf16le no bom with mac os 9 line ending", function (next) {
      const parser = parse({ encoding: "utf16le" }, (err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["a", "b"],
          ["1", "2"],
        ]);
        next();
      });
      const buf = Buffer.from("a,b\r1,2", "utf16le");
      for (let i = 0; i < buf.length; i++) {
        parser.write(Buffer.from([buf[i]]));
      }
      parser.end();
    });

    it("support utf16le no bom with unix line ending", function (next) {
      const parser = parse({ encoding: "utf16le" }, (err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["a", "b"],
          ["1", "2"],
        ]);
        next();
      });
      const buf = Buffer.from("a,b\n1,2", "utf16le");
      for (let i = 0; i < buf.length; i++) {
        parser.write(Buffer.from([buf[i]]));
      }
      parser.end();
    });

    it("support utf16le with bom with windows line ending", function (next) {
      const parser = parse({ bom: true }, (err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["a", "b"],
          ["1", "2"],
        ]);
        next();
      });
      const buf = Buffer.concat([
        Buffer.from([255, 254]),
        Buffer.from("a,b\r\n1,2", "utf16le"),
      ]);
      for (let i = 0; i < buf.length; i++) {
        parser.write(Buffer.from([buf[i]]));
      }
      parser.end();
    });
  });
});
