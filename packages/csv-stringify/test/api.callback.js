import "should";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { stringify } from "../lib/index.js";

describe("api.callback", function () {
  it("2 args: data, callback", function (next) {
    stringify(
      [
        ["field_1", "field_2"],
        ["value 1", "value 2"],
      ],
      (err, data) => {
        data.should.eql("field_1,field_2\nvalue 1,value 2\n");
        next();
      },
    );
  });

  it("2 args: options, callback", function (next) {
    const stringifier = stringify({ eof: false }, (err, data) => {
      data.should.eql("field_1,field_2\nvalue 1,value 2");
      next();
    });
    stringifier.write(["field_1", "field_2"]);
    stringifier.write(["value 1", "value 2"]);
    stringifier.end();
  });

  it("3 args: data, options, callback", function (next) {
    stringify(
      [
        ["field_1", "field_2"],
        ["value 1", "value 2"],
      ],
      { eof: false },
      (err, data) => {
        data.should.eql("field_1,field_2\nvalue 1,value 2");
        next();
      },
    );
  });

  it("does not invoke a throwing callback twice", function () {
    const result = spawnSync(
      process.execPath,
      [
        "--input-type=module",
        "--eval",
        `
          import assert from "node:assert/strict";
          import { stringify } from ${JSON.stringify(new URL("../lib/index.js", import.meta.url).href)};

          const error = new Error("Callback failed");
          let calls = 0;
          let caught = false;
          process.once("uncaughtException", (err) => {
            assert.equal(err, error);
            assert.equal(calls, 1);
            caught = true;
          });
          process.on("exit", () => assert.equal(caught, true));
          stringify([["value"]], () => {
            calls++;
            throw error;
          });
        `,
      ],
      { encoding: "utf8" },
    );
    assert.equal(result.status, 0, result.stderr);
  });

  it("catch error in end handler, see #386", function (next) {
    const input = Array.from({ length: 200000 }).map(() =>
      Array.from({ length: 100 }).map(
        () => "ABCDEFGHIJKLMNOPQRSTUVXYZ0123456789",
      ),
    );
    stringify(input, (err) => {
      if (err.code) {
        // Prior Node.js v26
        err.should.match({
          code: "ERR_STRING_TOO_LONG",
          message: "Cannot create a string longer than 0x1fffffe8 characters",
        });
      } else {
        // After Node.js v26
        err.should.match({
          message: "Invalid string length",
        });
      }
      next();
    });
  });
});
