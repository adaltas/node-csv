import "should";
import { stringify } from "../lib/index.js";

describe("Option `cast`", function () {
  describe("udf", function () {
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

  describe("info object", function () {
    it("preserves a reused cast result", function (next) {
      const result = { value: "shared", quoted: true };
      stringify(
        [["first", "second"]],
        { cast: { string: () => result } },
        (err, output) => {
          if (err) return next(err);
          output.should.eql('"shared","shared"\n');
          result.should.eql({ value: "shared", quoted: true });
          next();
        },
      );
    });

    it("accepts a frozen cast result", function (next) {
      const result = Object.freeze({ value: "frozen", quoted: true });
      stringify(
        [["input"]],
        { cast: { string: () => result } },
        (err, output) => {
          if (err) return next(err);
          output.should.eql('"frozen"\n');
          next();
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
