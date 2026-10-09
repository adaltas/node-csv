import "should";
import assert from "node:assert/strict";
import { parse } from "../lib/index.js";
import { parse as parseSync } from "../lib/sync.js";

describe("Option `objname`", function () {
  describe("validation", function () {
    it("does not accept boolean", function () {
      (() => {
        parse("", { objname: true }, () => {});
      }).should.throw(
        "Invalid Option: objname must be a string or a buffer, got true",
      );
    });
  });

  describe("normalized result mode", function () {
    it("returns a dictionary with the first column as key", function () {
      const records = parseSync("alice,A\nbob,B", { objname: 0 });
      assert.deepEqual(
        records,
        Object.assign(Object.create(null), {
          alice: ["alice", "A"],
          bob: ["bob", "B"],
        }),
      );
    });

    for (const objname of [null, false]) {
      it(`returns complete array records with objname ${objname}`, function (next) {
        parse("alice,A,extra\nbob,B,extra", { objname }, (err, records) => {
          if (err) return next(err);
          assert.deepEqual(records, [
            ["alice", "A", "extra"],
            ["bob", "B", "extra"],
          ]);
          next();
        });
      });
    }
  });
});
