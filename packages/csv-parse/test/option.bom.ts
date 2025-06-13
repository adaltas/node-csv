import "should";
import { parse } from "../lib/index.js";
import { assert_error } from "./api.assert_error.js";

describe("Option `bom`", function () {
  it("preserve bom if not defined", function (next) {
    const parser = parse((err, records) => {
      records.should.eql([
        ["\ufeffa", "b", "c"],
        ["d", "e", "f"],
      ]);
      next();
    });
    parser.write(Buffer.from("\ufeffa,b,c\n"));
    parser.write(Buffer.from("d,e,f"));
    parser.end();
  });

  it("preserve BOM if false", function (next) {
    const parser = parse({ bom: false }, (err, records) => {
      records.should.eql([
        ["\ufeffa", "b", "c"],
        ["d", "e", "f"],
      ]);
      next();
    });
    parser.write(Buffer.from("\ufeffa,b,c\n"));
    parser.write(Buffer.from("d,e,f"));
    parser.end();
  });

  it("with column option with bom `true`", function (next) {
    const parser = parse(
      {
        columns: true,
        bom: true,
      },
      (err, records) => {
        const record = records[0] as { key: string };
        record["key"].should.eql("value");
        next();
      },
    );
    parser.write(Buffer.from("\ufeffkey\nvalue"));
    parser.end();
  });

  it("with column option with bom `false`", function (next) {
    const parser = parse(
      {
        columns: true,
        bom: false,
      },
      (err, records) => {
        const record = records[0] as { "\ufeffkey": string };
        record["\ufeffkey"].should.eql("value");
        next();
      },
    );
    parser.write(Buffer.from("\ufeffkey\nvalue"));
    parser.end();
  });

  it("throw parsing error if quote follow bom", function (next) {
    const parser = parse((err) => {
      if (!err) return next(Error("Invalid assessment"));
      assert_error(err, {
        message:
          'Invalid Opening Quote: a quote is found on field 0 at line 1, value is "\ufeff" (utf8 bom)',
        code: "INVALID_OPENING_QUOTE",
        field: "\ufeff",
      });
      next();
    });
    parser.write(Buffer.from('\ufeff"a",b,c\n'));
    parser.write(Buffer.from("d,e,f"));
    parser.end();
  });

  it("handle BOM with utf8 (default)", function (next) {
    const parser = parse({ bom: true }, (err, records) => {
      records.should.eql([
        ["a", "b", "c"],
        ["d", "e", "f"],
      ]);
      next();
    });
    parser.write(Buffer.from("\ufeffa,b,c\n"));
    parser.write(Buffer.from("d,e,f"));
    parser.end();
  });

  it("preserve data if BOM is true", function (next) {
    const parser = parse({ bom: true }, (err, records) => {
      records.should.eql([
        ["a", "b", "c"],
        ["d", "e", "f"],
      ]);
      next();
    });
    parser.write(Buffer.from("a,b,c\n"));
    parser.write(Buffer.from("d,e,f"));
    parser.end();
  });

  it("handle BOM even if no enough data in the first package", function (next) {
    const parser = parse({ bom: true }, (err, records) => {
      records.should.eql([
        ["a", "b", "c"],
        ["d", "e", "f"],
      ]);
      next();
    });
    parser.write(Buffer.from([239]));
    parser.write(Buffer.from([187]));
    parser.write(Buffer.from([191]));
    parser.write(Buffer.from("a,b,c\n"));
    parser.write(Buffer.from("d,e,f"));
    parser.end();
  });

  it("preserve data if no enough data to detect BOM", function (next) {
    const parser = parse({ bom: true }, (err, records) => {
      records.should.eql([["\ufffd"]]);
      next();
    });
    parser.write(Buffer.from([239, 187]));
    parser.end();
  });
});
