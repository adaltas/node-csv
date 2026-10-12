import "should";
import assert from "node:assert/strict";
import { stringify } from "../lib/index.js";
import { stringify as stringifySync } from "../lib/sync.js";

describe("Option `cast`", function () {
  describe("configuration", function () {
    for (const frozen of [false, true]) {
      it(`preserves ${frozen ? "frozen" : "mutable"} options in the sync API`, function () {
        const string = (value) => value.toUpperCase();
        const cast = { string, number: null };
        if (frozen) Object.freeze(cast);
        for (let i = 0; i < 2; i++) {
          assert.equal(stringifySync([["value", 42]], { cast }), "VALUE,42\n");
        }
        assert.deepEqual(cast, { string, number: null });
      });

      it(`preserves ${frozen ? "frozen" : "mutable"} options in the callback API`, function (next) {
        const string = (value) => value.toUpperCase();
        const cast = { string };
        if (frozen) Object.freeze(cast);
        stringify([["value", 42]], { cast }, (err, output) => {
          if (err) return next(err);
          assert.equal(output, "VALUE,42\n");
          assert.deepEqual(cast, { string });
          next();
        });
      });
    }

    it("preserves inherited and non-enumerable custom casters", function () {
      const cast = Object.create({ string: (value) => value.toUpperCase() });
      Object.defineProperty(cast, "number", { value: () => "number" });
      assert.equal(stringifySync([["value", 42]], { cast }), "VALUE,number\n");
    });

    it("preserves custom null and undefined casters", function () {
      const cast = {
        null: () => "null",
        undefined: () => "missing",
      };
      assert.equal(
        stringifySync([[null, undefined]], { cast }),
        "null,missing\n",
      );
    });
  });

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
        (function () {
          stringifySync([["input"]], { cast: { string: () => ({ value }) } });
        }).should.throw({ message });
      });
    }

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
