import "should";
import assert from "node:assert";
import { stringify } from "../lib/index.js";
import { stringify as stringifySync } from "../lib/sync.js";

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
    for (const value of [0, false]) {
      const message = `Invalid Casting Value: returned value must return a string, null or undefined, got ${JSON.stringify(value)}`;

      it(`reject invalid value ${JSON.stringify(value)} in the callback API`, function (next) {
        stringify(
          [["input"]],
          { cast: { string: () => ({ value }) } },
          (err) => {
            if (!err)
              return next(Error("Expected an invalid casting value error"));
            err.message.should.eql(message);
            next();
          },
        );
      });

      it(`reject invalid value ${JSON.stringify(value)} in the sync API`, function () {
        assert.throws(
          () =>
            stringifySync([["input"]], { cast: { string: () => ({ value }) } }),
          { message },
        );
      });
    }

    it("accept string, null and undefined values in cast options", function (next) {
      stringify(
        [["empty", "null", "undefined", "text"]],
        {
          cast: {
            string: (value, context) => ({
              value: ["", null, undefined, "text"][context.index],
            }),
          },
        },
        (err, data) => {
          if (err) return next(err);
          data.should.eql(",,,text\n");
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
