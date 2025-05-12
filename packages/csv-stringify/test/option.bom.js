import "should";
import { stringify } from "../lib/index.js";
import { stringify as stringifySync } from "../lib/sync.js";

describe("Option `bom`", function () {
  it("validate", function () {
    (() => {
      stringify([], { bom: "invalid" }, () => {});
    }).should.throw({
      code: "CSV_OPTION_BOOLEAN_INVALID_TYPE",
      message:
        'option `bom` is optional and must be a boolean value, got "invalid"',
    });
  });

  it("empty", function (next) {
    stringify([], { bom: true }, (err, data) => {
      data.should.eql(Buffer.from([239, 187, 191]).toString());
      next();
    });
  });

  it("value is `true`", function (next) {
    stringify(
      [
        {
          value: "ok",
        },
      ],
      { bom: true },
      (err, data) => {
        data.should.eql(Buffer.from([239, 187, 191]).toString() + "ok\n");
        next();
      },
    );
  });

  it("value is `false`", function (next) {
    stringify(
      [
        {
          value: "ok",
        },
      ],
      { bom: false },
      (err, data) => {
        data.should.eql("ok\n");
        next();
      },
    );
  });

  describe("sync ", function () {
    it("validate", function () {
      (() => {
        stringifySync([], { bom: "invalid" });
      }).should.throw({
        code: "CSV_OPTION_BOOLEAN_INVALID_TYPE",
        message:
          'option `bom` is optional and must be a boolean value, got "invalid"',
      });
    });

    it("empty", function () {
      const data = stringifySync([], { bom: true });
      data.should.eql(Buffer.from([239, 187, 191]).toString());
    });

    it("value is `true`", function () {
      const res = stringifySync(
        [
          {
            value: "ok",
          },
        ],
        { bom: true },
      );
      res.should.eql("\ufeffok\n");
    });

    it("value is `false`", function () {
      const res = stringifySync(
        [
          {
            value: "ok",
          },
        ],
        { bom: false },
      );
      res.should.eql("ok\n");
    });
  });
});
