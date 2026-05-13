import "should";
import dedent from "dedent";
import { stringify } from "../lib/index.js";

describe("Option `cast`", function () {
  describe("default", function () {
    it("default BigInt formatter", function (next) {
      stringify(
        [
          {
            value: BigInt(9007199254740991),
          },
        ],
        (err, data) => {
          if (!err) data.should.eql("9007199254740991\n");
          next(err);
        },
      );
    });
  });

  describe("udf", function () {
    it("catch error", function (next) {
      stringify(
        [
          {
            value: true,
          },
        ],
        {
          cast: {
            boolean: () => {
              throw Error("Catchme");
            },
          },
        },
        (err) => {
          if (!err) return next(Error("Invalid assessment"));
          err.message.should.eql("Catchme");
          next();
        },
      );
    });

    it("return null", function (next) {
      stringify(
        [
          { a: true, b: true },
          { a: false, b: true },
          { a: true, b: false },
          { a: false, b: false },
        ],
        { cast: { boolean: (value) => (value ? "1" : null) } },
        (err, data) => {
          if (err) return next(err);
          data.trim().should.eql("1,1\n,1\n1,\n,");
          next();
        },
      );
    });
  });

  describe("context", function () {
    it("expose the expected properties", function (next) {
      stringify(
        [["a"]],
        {
          cast: {
            string: (value, context) => {
              Object.keys(context)
                .sort()
                .should.eql(["column", "header", "index", "records"]);
              return "";
            },
          },
        },
        next,
      );
    });

    it("index and column on array", function (next) {
      stringify(
        [[true, false]],
        {
          cast: {
            boolean: (value, context) => {
              if (context.column == null) throw Error("Invalid assessment");
              if (value) {
                context.index.should.equal(0);
                context.column.should.equal(0);
                return "yes";
              } else {
                context.index.should.equal(1);
                context.column.should.equal(1);
                return "no";
              }
            },
          },
        },
        (err, data) => {
          if (!err) data.trim().should.eql("yes,no");
          next(err);
        },
      );
    });

    it("index and column on object", function (next) {
      stringify(
        [
          {
            is_true: true,
            is_false: false,
          },
        ],
        {
          cast: {
            boolean: (value, context) => {
              if (!context.column) throw Error("Invalid assessment");
              if (value) {
                context.index.should.equal(0);
                context.column.should.equal("is_true");
                return "yes";
              } else {
                context.index.should.equal(1);
                context.column.should.equal("is_false");
                return "no";
              }
            },
          },
        },
        (err, data) => {
          if (!err) data.trim().should.eql("yes,no");
          next(err);
        },
      );
    });

    it("header", function (next) {
      stringify(
        [["value 1"], ["value 2"]],
        {
          header: true,
          columns: ["header"],
          cast: {
            string: (value, context) => `${value} | ${context.header}`,
          },
        },
        (err, data) => {
          if (!err)
            data
              .trim()
              .should.eql("header | true\nvalue 1 | false\nvalue 2 | false");
          next(err);
        },
      );
    });
  });

  describe("option header", function () {
    it("records with header and columns as array", function (next) {
      stringify(
        [["value 1"], ["value 2"]],
        {
          header: true,
          columns: ["header"],
          cast: {
            string: (value, context) => `${context.records}`,
          },
        },
        (err, data) => {
          if (!err) data.trim().should.eql("0\n0\n1");
          next(err);
        },
      );
    });

    it("records without header", function (next) {
      stringify(
        [["record 1"], ["record 2"]],
        {
          cast: {
            string: (value, context) => `${context.records}`,
          },
        },
        (err, data) => {
          if (!err) data.trim().should.eql("0\n1");
          next(err);
        },
      );
    });
  });

  describe("info object", function () {
    it("modify escape", function (next) {
      stringify(
        [['record " 1'], ['record " 2'], ['record " 3']],
        {
          eof: false,
          escape: "#",
          cast: {
            string: (value, context) => {
              if (context.records === 2) return value;
              return {
                value: value,
                escape: ["\\", '"'][context.records],
              };
            },
          },
        },
        (err, data) => {
          data.should.eql(dedent`
            "record \" 1"
            "record "" 2"
            "record #" 3"
          `);
          next(err);
        },
      );
    });
  });
});
