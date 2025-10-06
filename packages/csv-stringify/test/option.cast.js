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
