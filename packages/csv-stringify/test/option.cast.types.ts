import "should";
import { stringify } from "../lib/index.js";

describe("Option `cast` with null and undefined", function () {
  it("cast.bigint formatter", function (next) {
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

  it("cast.boolean formatter", function (next) {
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

  it("cast.date formatter", function (next) {
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

  it("cast.null can emit unquoted NULL", function (next) {
    stringify(
      [{ a: "foo", b: null, c: "bar" }],
      {
        header: true,
        cast: {
          null: function () {
            return { value: "NULL", quoted: false };
          },
        },
      },
      (err, data) => {
        if (!err) {
          data.should.eql("a,b,c\nfoo,NULL,bar\n");
        }
        next(err);
      },
    );
  });

  it("cast.null receives expected context", function (next) {
    stringify(
      [[null]],
      {
        cast: {
          null: function (value, context) {
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

  it("cast.null returning a string respects quoting rules", function (next) {
    stringify(
      [{ a: "foo", b: null, c: "bar" }],
      {
        quoted: true,
        cast: {
          null: function () {
            return "NULL";
          },
        },
      },
      (err, data) => {
        if (!err) {
          data.should.eql('"foo","NULL","bar"\n');
        }
        next(err);
      },
    );
  });

  it("cast.null catches error and surfaces it", function (next) {
    stringify(
      [[null]],
      {
        cast: {
          null: function () {
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

  it("cast.number formatter", function (next) {
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

  it("cast.object formatter", function (next) {
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

  it("cast.string formatter", function (next) {
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

  it("cast.undefined can emit unquoted NULL", function (next) {
    stringify(
      [{ a: "foo", b: undefined, c: "bar" }],
      {
        header: true,
        cast: {
          undefined: function () {
            return { value: "NULL", quoted: false };
          },
        },
      },
      (err, data) => {
        if (!err) {
          data.should.eql("a,b,c\nfoo,NULL,bar\n");
        }
        next(err);
      },
    );
  });
});
