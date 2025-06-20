import "should";
import { stringify } from "../lib/index.js";

describe("Option `columns`", function () {
  describe("definition", function () {
    it("is an array with column object", function (next) {
      stringify(
        [
          { a: "11", b: "12" },
          { a: "21", b: "22" },
        ],
        {
          columns: [{ key: "b" }, { key: "a" }],
        },
        (err, records) => {
          records.should.eql("12,11\n22,21\n");
          next(err);
        },
      );
    });

    it("is an array of strings", function (next) {
      stringify(
        [
          { a: "11", b: "12" },
          { a: "21", b: "22" },
        ],
        {
          columns: ["b", "a"],
        },
        (err, records) => {
          records.should.eql("12,11\n22,21\n");
          next(err);
        },
      );
    });

    it("is an array of strings matching nested object", function (next) {
      stringify(
        [
          { a: { a1: "1a1", a2: "1a2" }, b: "1b" },
          { a: { a1: "2a1", a2: "2a2" }, b: "2b" },
        ],
        {
          columns: ["b", "a.a2"],
        },
        (err, records) => {
          records.should.eql("1b,1a2\n2b,2a2\n");
          next(err);
        },
      );
    });

    it("is an array of strings matching nested [object]", function (next) {
      stringify(
        [
          { a: [{}, { a1: "1a1", a2: "1a2" }], b: "1b" },
          { a: [{}, { a1: "2a1", a2: "2a2" }], b: "2b" },
        ],
        {
          columns: ["b", "a[1].a2"],
        },
        (err, records) => {
          records.should.eql("1b,1a2\n2b,2a2\n");
          next(err);
        },
      );
    });

    it("is an array of strings with parent key not matching a nested object", function (next) {
      stringify(
        [
          { a: undefined, b: "1b" },
          { a: null, b: "2b" },
          { a: false, b: "3b" },
        ],
        {
          columns: ["b", "a.a2"],
        },
        (err, records) => {
          records.should.eql("1b,\n2b,\n3b,\n");
          next(err);
        },
      );
    });

    it("can still access fields with dots", function (next) {
      stringify(
        [{ "foo.bar": "1" }, { "foo.bar": "2" }],
        {
          header: true,
        },
        (err, records) => {
          if (!err) records.should.eql("foo.bar\n1\n2\n");
          next(err);
        },
      );
    });
  });

  describe("input", function () {
    it("is an array, should be the same length", function (next) {
      stringify(
        [
          ["20322051544", "1979", "8.8017226E7", "ABC", "45", "2000-01-01"],
          ["28392898392", "1974", "8.8392926E7", "DEF", "23", "2050-11-27"],
        ],
        {
          columns: ["FIELD_1", "FIELD_2"],
        },
        (err, data) => {
          if (!err) data.should.eql("20322051544,1979\n28392898392,1974\n");
          next(err);
        },
      );
    });

    it("is a readable stream", function (next) {
      const ws = stringify(
        {
          header: true,
          columns: { field1: "column1", field3: "column3" },
        },
        (err, data) => {
          if (!err)
            data.should.eql("column1,column3\nval11,val13\nval21,val23\n");
          next(err);
        },
      );
      ws.write({ field1: "val11", field2: "val12", field3: "val13" });
      ws.write({ field1: "val21", field2: "val22", field3: "val23" });
      ws.end();
    });
  });
});
