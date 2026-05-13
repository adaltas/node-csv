import "should";
import { stringify } from "../lib/index.js";

describe("Option `cast` with null and undefined", function () {
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
});
