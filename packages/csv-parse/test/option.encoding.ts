import "should";
import { parse } from "../lib/index.js";

describe("Option `encoding`", function () {
  describe("validation & normalization", function () {
    it("boolean true convert to default", function () {
      parse({ encoding: true }).options.encoding?.should.eql("utf8");
    });

    it("boolean false convert to null", function () {
      (parse({ encoding: false }).options.encoding === null).should.be.true();
    });
  });

  describe("unaligned multi-byte delimiter matches", function () {
    // In utf16le, a code unit is 2 bytes: a delimiter is only a delimiter
    // when it starts on a code unit boundary. The bytes below spell a valid
    // delimiter halfway through a code unit; the value must survive intact.
    it("does not match a record delimiter inside a code unit", function (next) {
      parse(Buffer.from("\u0a01\u0100", "utf16le"), {
        encoding: "utf16le",
        record_delimiter: "\n",
      }, (err, records) => {
        if (err) return next(err);
        records.should.eql([["\u0a01\u0100"]]);
        next();
      });
    });

    it("does not match a carriage return inside a code unit", function (next) {
      parse(Buffer.from("\u0d01\u0100", "utf16le"), {
        encoding: "utf16le",
        record_delimiter: "\r",
      }, (err, records) => {
        if (err) return next(err);
        records.should.eql([["\u0d01\u0100"]]);
        next();
      });
    });

    it("does not match a field delimiter inside a code unit", function (next) {
      parse(Buffer.from("\u2c01\u0100", "utf16le"), {
        encoding: "utf16le",
        delimiter: ",",
      }, (err, records) => {
        if (err) return next(err);
        records.should.eql([["\u2c01\u0100"]]);
        next();
      });
    });
  });

  describe("definition", function () {
    it("with delimiter", function (next) {
      parse(
        Buffer.from("x:x", "utf16le"),
        {
          delimiter: ":",
          encoding: "utf16le",
        },
        (err, records) => {
          if (err) return next(err);
          records.should.eql([["x", "x"]]);
          next();
        },
      );
    });

    it("with escape equals quote", function (next) {
      parse(
        Buffer.from('a,b,c\n1,"2 ""3"" 4",5', "utf16le"),
        {
          encoding: "utf16le",
        },
        (err, records) => {
          if (err) return next(err);
          records.should.eql([
            ["a", "b", "c"],
            ["1", '2 "3" 4', "5"],
          ]);
          next();
        },
      );
    });

    it("null return buffer", function (next) {
      parse(
        Buffer.from("a,b\n1,2"),
        {
          encoding: null,
        },
        (err, records) => {
          if (err) return next(err);
          records.should.eql([
            [Buffer.from("a"), Buffer.from("b")],
            [Buffer.from("1"), Buffer.from("2")],
          ]);
          next();
        },
      );
    });
  });

  describe("with BOM", function () {
    it("utf16le auto detected", function (next) {
      const parser = parse(
        { bom: true, encoding: "utf16le" },
        (err, records) => {
          if (err) return next(err);
          records.should.eql([
            ["a", "b", "c"],
            ["d", "e", "f"],
          ]);
          next();
        },
      );
      parser.write(Buffer.from("\ufeffa,b,c\n", "utf16le"));
      parser.write(Buffer.from("d,e,f", "utf16le"));
      parser.end();
    });

    it("utf16le auto detected with quote", function (next) {
      const parser = parse({ bom: true }, (err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["a", "b", "c"],
          ["d", "e", "f"],
        ]);
        next();
      });
      parser.write(Buffer.from('\ufeffa,"b",c\n', "utf16le"));
      parser.write(Buffer.from('d,"e",f', "utf16le"));
      parser.end();
    });

    it("utf16le auto detected with delimiter", function (next) {
      const parser = parse({ bom: true, delimiter: "ф" }, (err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["a", "b", "c"],
          ["d", "e", "f"],
        ]);
        next();
      });
      parser.write(Buffer.from("\ufeffaфbфc\n", "utf16le"));
      parser.write(Buffer.from("dфeфf", "utf16le"));
      parser.end();
    });

    it("utf16le auto detected with escape", function (next) {
      const parser = parse({ bom: true, escape: "ф" }, (err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["a", '"b', "c"],
          ["d", '"e', "f"],
        ]);
        next();
      });
      parser.write(Buffer.from('\ufeffa,"ф"b",c\n', "utf16le"));
      parser.write(Buffer.from('d,"ф"e",f', "utf16le"));
      parser.end();
    });

    it("utf16le auto detected with record_delimiter", function (next) {
      const parser = parse(
        { bom: true, record_delimiter: "ф" },
        (err, records) => {
          if (err) return next(err);
          records.should.eql([
            ["a", "b", "c"],
            ["d", "e", "f"],
          ]);
          next();
        },
      );
      parser.write(Buffer.from("\ufeffa,b,cф", "utf16le"));
      parser.write(Buffer.from("d,e,f", "utf16le"));
      parser.end();
    });
  });
});
