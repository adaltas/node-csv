import "should";
import { generate } from "csv-generate";
import { parse, Parser } from "../lib/index.js";

describe("API arguments", function () {
  it("exports Parser class", function () {
    Parser.should.be.a.Function;
  });

  describe("0 arg", function () {
    it("no arguments", function (next) {
      const records: string[] = [];
      const parser = parse();
      parser.on("readable", function () {
        let d;
        while ((d = parser.read())) {
          records.push(d);
        }
      });
      parser.on("err", (err) => {
        next(err);
      });
      parser.on("end", () => {
        records.should.eql([
          ["field_1", "field_2"],
          ["value 1", "value 2"],
        ]);
        next();
      });
      parser.write("field_1,field_2\nvalue 1,value 2");
      parser.end();
    });
  });

  describe("1 arg", function () {
    it("callback:function; pipe data and get result in callback", function (next) {
      generate({ length: 2, seed: 1, columns: 2, fixed_size: true }).pipe(
        parse((err, records) => {
          if (err) return next(err);
          records.should.eql([
            ["OMH", "ONKCHhJmjadoA"],
            ["D", "GeACHiN"],
          ]);
          next();
        }),
      );
    });

    it("options:object; write data and read stream", function (next) {
      const records: string[] = [];
      const parser = parse({ columns: true });
      parser.on("readable", function () {
        let d;
        while ((d = parser.read())) {
          records.push(d);
        }
      });
      parser.on("err", (err) => {
        next(err);
      });
      parser.on("end", () => {
        records.should.eql([{ field_1: "value 1", field_2: "value 2" }]);
        next();
      });
      parser.write("field_1,field_2\nvalue 1,value 2");
      parser.end();
    });
  });

  describe("2 args", function () {
    it("data:string, options:object; read stream", function (next) {
      const records: string[] = [];
      const parser = parse("field_1,field_2\nvalue 1,value 2", {
        columns: true,
      });
      parser.on("readable", function () {
        let d;
        while ((d = parser.read())) {
          records.push(d);
        }
      });
      parser.on("err", (err) => {
        next(err);
      });
      parser.on("end", () => {
        records.should.eql([{ field_1: "value 1", field_2: "value 2" }]);
        next();
      });
    });

    it("options:object, callback:function; write data and get result in callback", function (next) {
      interface RowType {
        field_1: string;
        field_2: string;
      }
      const parser = parse<RowType>({ columns: true }, (err, records) => {
        if (err) return next(err);
        records.should.eql([{ field_1: "value 1", field_2: "value 2" }]);
        next();
      });
      parser.write("field_1,field_2\nvalue 1,value 2");
      parser.end();
    });

    it("data:string, callback:function", function (next) {
      parse("value a,value b\nvalue 1,value 2", (err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["value a", "value b"],
          ["value 1", "value 2"],
        ]);
        next();
      });
    });

    it("data:buffer, callback:function", function (next) {
      parse(Buffer.from("value a,value b\nvalue 1,value 2"), (err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["value a", "value b"],
          ["value 1", "value 2"],
        ]);
        next();
      });
    });
  });

  describe("3 args", function () {
    it("data:string, options:object, callback:function", function (next) {
      interface RowType {
        field_1: string;
        field_2: string;
      }
      parse<RowType>(
        "field_1,field_2\nvalue 1,value 2",
        { columns: true },
        (err, records) => {
          if (err) return next(err);
          records.should.eql([{ field_1: "value 1", field_2: "value 2" }]);
          next();
        },
      );
    });

    it("data:buffer, options:object, callback:function", function (next) {
      interface RowType {
        field_1: string;
        field_2: string;
      }
      parse<RowType>(
        Buffer.from("field_1,field_2\nvalue 1,value 2"),
        { columns: true },
        (err, records) => {
          if (err) return next(err);
          records.should.eql([{ field_1: "value 1", field_2: "value 2" }]);
          next();
        },
      );
    });

    it("data:string, options:object, callback:undefined", function () {
      (() => {
        parse("field_1,field_2\nvalue 1,value 2", { columns: true }, undefined);
      }).should.throw({
        message: "Invalid argument: got undefined at index 2",
        code: "CSV_INVALID_ARGUMENT",
      });
    });
  });
});
