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
    it("handle string formatter", function (next) {
      stringify(
        [
          {
            value: "ok",
          },
        ],
        { cast: { string: () => "X" } },
        (err, data) => {
          if (!err) data.should.eql("X\n");
          next(err);
        },
      );
    });

    it("handle boolean formatter", function (next) {
      stringify(
        [
          {
            value: true,
          },
        ],
        { cast: { boolean: () => "X" } },
        (err, data) => {
          if (!err) data.should.eql("X\n");
          next(err);
        },
      );
    });

    it("handle date formatter", function (next) {
      stringify(
        [
          {
            value: new Date(),
          },
        ],
        { cast: { date: () => "X" } },
        (err, data) => {
          if (!err) data.should.eql("X\n");
          next(err);
        },
      );
    });

    it("handle number formatter", function (next) {
      stringify(
        [
          {
            value: 3.14,
          },
        ],
        { cast: { number: (value) => "" + value * 2 } },
        (err, data) => {
          if (!err) data.should.eql("6.28\n");
          next(err);
        },
      );
    });

    it("handle bigint formatter", function (next) {
      stringify(
        [
          {
            value: BigInt(9007199254740991),
          },
        ],
        { cast: { bigint: (value) => "" + value / BigInt(2) } },
        (err, data) => {
          if (!err) data.should.eql("4503599627370495\n");
          next(err);
        },
      );
    });

    it("handle object formatter", function (next) {
      stringify(
        [
          {
            value: { a: 1 },
          },
        ],
        { cast: { object: () => "X" } },
        (err, data) => {
          if (!err) data.should.eql("X\n");
          next(err);
        },
      );
    });

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
          data.trim().should.eql("1,1\n,1\n1,\n,");
          next();
        },
      );
    });

    it("boolean must return a string", function (next) {
      stringify(
        [
          {
            value: true,
          },
        ],
        { cast: { boolean: (value) => (value ? 1 : 0) } },
        (err) => {
          err.message.should.eql(
            "Invalid Casting Value: returned value must return a string, an object, null or undefined, got 1",
          );
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
              return null;
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

    it("validate and normalize local options", function (next) {
      stringify(
        [["invalid cast"]],
        {
          eof: false,
          escape: "#",
          cast: {
            string: (value) => ({
              value: value,
              quote: NaN,
            }),
          },
        },
        (err) => {
          err.code.should.eql("CSV_OPTION_QUOTE_INVALID_TYPE");
          next();
        },
      );
    });
  });
});
