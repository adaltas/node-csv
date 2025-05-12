import "should";
import { parse } from "../lib/index.js";
import { assert_error } from "./api.assert_error.js";

describe("API events", function () {
  it("emit `readable` event", function (next) {
    const records = [];
    const parser = parse();
    parser.on("readable", () => {
      let record;
      while ((record = parser.read())) {
        records.push(record);
      }
    });
    parser.write('"ABC","45"\n"DEF","23"');
    parser.on("end", () => {
      records.should.eql([
        ["ABC", "45"],
        ["DEF", "23"],
      ]);
      next();
    });
    parser.end();
  });

  it("emit `data` event", function (next) {
    const records = [];
    const parser = parse();
    parser.on("data", (record) => {
      records.push(record);
    });
    parser.write('"ABC","45"\n"DEF","23"');
    parser.on("end", () => {
      records.should.eql([
        ["ABC", "45"],
        ["DEF", "23"],
      ]);
      next();
    });
    parser.end();
  });

  it("ensure error in _transform is called once", function (next) {
    const data = ' x  " a b",x "   c d"\nx " e f", x  "   g h"';
    const parser = parse((err) => {
      assert_error(err, {
        message:
          'Invalid Opening Quote: a quote is found on field 0 at line 1, value is " x  "',
        code: "INVALID_OPENING_QUOTE",
        field: " x  ",
      });
      next();
    });
    for (const chr of data) {
      parser.write(chr);
    }
    parser.end();
  });

  it("emit `error`", function (next) {
    const parser = parse();
    parser.on("readable", () => {
      while (parser.read()) true;
    });
    parser.on("end", () => {
      next(Error("End should not be fired"));
    });
    parser.on("error", (err) => {
      err.message.should.eql(
        "Invalid Record Length: expect 3, got 2 on line 2",
      );
      next();
    });
    parser.write("a,a,a\nb,b");
    parser.end();
  });

  it("emit `error` with data as argument", function (next) {
    const parser = parse("a,a,a\nb,b\nc,c,c");
    parser.on("end", () => {
      next(Error("End should not be fired"));
    });
    parser.on("error", (err) => {
      err.message.should.eql(
        "Invalid Record Length: expect 3, got 2 on line 2",
      );
      next();
    });
  });

  it("emit `destroy` event", function (next) {
    const parser = parse("a,a,a\nb,b,b\nc,c,c");
    parser.on("readable", () => {
      while (parser.read() !== null) true;
    });
    parser.on("close", next);
    parser.on("error", () => {
      next(Error("Event `error` should not be fired"));
    });
  });

  it("emit `destroy` event with `to_line` option", function (next) {
    // See https://github.com/adaltas/node-csv/issues/333
    const parser = parse("a,a,a\nb,b,b\nc,c,c", { to_line: 2 });
    parser.on("readable", () => {
      while (parser.read() !== null) true;
    });
    parser.on("close", next);
    parser.on("error", () => {
      next(Error("Event `error` should not be fired"));
    });
  });
});
