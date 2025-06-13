import "should";
import dedent from "dedent";
import { parse } from "../lib/index.js";

describe("Option `objname`", function () {
  describe("validation", function () {
    it("basic", function () {
      parse("", { objname: "sth", columns: true }, () => {});
      parse("", { objname: Buffer.from("sth"), columns: true }, () => {});
      parse("", { objname: 1 }, () => {});
      parse("", { objname: null }, () => {});
      parse("", { objname: undefined }, () => {});
      (() => {
        parse("", { objname: "" }, () => {});
      }).should.throw("Invalid Option: objname must be a non empty string");
      (() => {
        parse("", { objname: Buffer.from("") }, () => {});
      }).should.throw("Invalid Option: objname must be a non empty buffer");
    });

    it("field require columns", function () {
      (() => {
        parse("", { objname: "field" }, () => {});
      }).should.throw(
        [
          "Invalid Option:",
          "objname field must be combined with columns",
          "or be defined as an index",
        ].join(" "),
      );
    });

    it("index incompatible with columns", function () {
      (() => {
        parse("", { objname: 1, columns: true }, () => {});
      }).should.throw(
        [
          "Invalid Option:",
          "objname index cannot be combined with columns",
          "or be defined as a field",
        ].join(" "),
      );
    });
  });

  describe("map to a field", function () {
    it("convert a buffer to a column name", function (next) {
      parse(
        `a,b,c`,
        { objname: Buffer.from("h1"), columns: ["h1", "h2", "h3"] },
        (err, records) => {
          if (!err) {
            records.should.eql({
              a: {
                h1: "a",
                h2: "b",
                h3: "c",
              },
            });
          }
          next(err);
        },
      );
    });

    it("should print object of objects with properties using value of given column from columns", function (next) {
      parse(
        dedent`
          a,b,c
          d,e,f
        `,
        { objname: "FIELD_1", columns: ["FIELD_1", "FIELD_2", "FIELD_3"] },
        (err, records) => {
          if (err) return next(err);
          records.should.eql({
            a: {
              FIELD_1: "a",
              FIELD_2: "b",
              FIELD_3: "c",
            },
            d: {
              FIELD_1: "d",
              FIELD_2: "e",
              FIELD_3: "f",
            },
          });
          next(err);
        },
      );
    });

    it("should print object of objects with properties using value of given column from header record", function (next) {
      parse(
        dedent`
          FIELD_1,FIELD_2,FIELD_3
          a,b,c
          d,e,f
        `,
        { objname: "FIELD_1", columns: true },
        (err, records) => {
          if (err) return next(err);
          records.should.eql({
            a: {
              FIELD_1: "a",
              FIELD_2: "b",
              FIELD_3: "c",
            },
            d: {
              FIELD_1: "d",
              FIELD_2: "e",
              FIELD_3: "f",
            },
          });
          next();
        },
      );
    });

    it("combined with info", function (next) {
      parse(
        dedent`
          FIELD_1,FIELD_2,FIELD_3
          a,b,c
          d,e,f
        `,
        { objname: "FIELD_2", columns: true, info: true },
        (err, records) => {
          if (err) return next(err);
          records.should.match({
            b: {
              record: {
                FIELD_1: "a",
                FIELD_2: "b",
                FIELD_3: "c",
              },
              info: {
                bytes: 30,
                lines: 2,
              },
            },
            e: {
              record: {
                FIELD_1: "d",
                FIELD_2: "e",
                FIELD_3: "f",
              },
              info: {
                bytes: 35,
                lines: 3,
              },
            },
          });
          next();
        },
      );
    });
  });

  describe("map to an index", function () {
    it("get value associated with index", function (next) {
      parse(
        dedent`
          a,b,c
          d,e,f
        `,
        { objname: 1 },
        (err, records) => {
          if (err) return next(err);
          records.should.eql({
            b: ["a", "b", "c"],
            e: ["d", "e", "f"],
          });
          next();
        },
      );
    });

    it("combined with info", function (next) {
      parse(
        dedent`
          a,b,c
          d,e,f
        `,
        { objname: 1, info: true },
        (err, records) => {
          if (err) return next(err);
          records.should.match({
            b: {
              record: ["a", "b", "c"],
              info: {
                bytes: 6,
                lines: 1,
              },
            },
            e: {
              record: ["d", "e", "f"],
              info: {
                bytes: 11,
                lines: 2,
              },
            },
          });
          next();
        },
      );
    });
  });
});
