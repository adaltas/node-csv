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
    for (const objname of [undefined, null, false]) {
      it(`returns complete array records with objname ${objname}`, function (next) {
        const input = "alice,A,extra\nbob,B,extra";
        const expected = [
          ["alice", "A", "extra"],
          ["bob", "B", "extra"],
        ];
        assert.deepEqual(parseSync(input, { objname }), expected);
        parse(input, { objname }, (err, records) => {
          if (err) return next(err);
          assert.deepEqual(records, expected);
          next();
        });
      });

      it(`returns column records with objname ${objname}`, function (next) {
        const input = "name,value\nalice,A\nbob,B";
        const options = { objname, columns: true };
        const expected = [
          { name: "alice", value: "A" },
          { name: "bob", value: "B" },
        ];
        assert.deepEqual(parseSync(input, options), expected);
        parse(input, options, (err, records) => {
          if (err) return next(err);
          assert.deepEqual(records, expected);
          next();
        });
      });

      it(`returns an empty array with objname ${objname}`, function (next) {
        assert.deepEqual(parseSync("", { objname }), []);
        parse("", { objname }, (err, records) => {
          if (err) return next(err);
          assert.deepEqual(records, []);
          next();
        });
      });
    }

    for (const objname of [0, 1]) {
      it(`returns a serializable dictionary for column index ${objname}`, function (next) {
        const input = "alice,A\nbob,B";
        const expected = {
          [objname === 0 ? "alice" : "A"]: ["alice", "A"],
          [objname === 0 ? "bob" : "B"]: ["bob", "B"],
        };
        const syncRecords = parseSync(input, { objname });
        assert.equal(Object.getPrototypeOf(syncRecords), null);
        assert.equal(JSON.stringify(syncRecords), JSON.stringify(expected));
        parse(input, { objname }, (err, records) => {
          if (err) return next(err);
          assert.deepEqual(records, syncRecords);
          next();
        });
      });
    }

    it("preserves reserved property names in the first column", function () {
      const keys = ["length", "__proto__", "constructor", "toString", "2", ""];
      const input = keys.map((key) => `${key},value`).join("\n");
      const records = parseSync(input, { objname: 0 });
      assert.equal(Object.getPrototypeOf(records), null);
      assert.deepEqual(
        JSON.parse(JSON.stringify(records)),
        Object.fromEntries(keys.map((key) => [key, [key, "value"]])),
      );
    });

    it("preserves raw records and info with the first column as key", function (next) {
      const input = "alice,A\nbob,B";
      const options = { objname: 0, raw: true, info: true };
      const syncRecords = parseSync(input, options);
      assert.equal(Object.getPrototypeOf(syncRecords), null);
      parse(input, options, (err, records) => {
        if (err) return next(err);
        assert.deepEqual(records, syncRecords);
        assert.deepEqual(records.alice.record, ["alice", "A"]);
        assert.equal(records.alice.raw, "alice,A\n");
        assert.equal(records.alice.info.records, 1);
        next();
      });
    });

    for (const objname of [0, 1, "key"]) {
      it(`returns an empty dictionary with objname ${objname}`, function (next) {
        const options = {
          objname,
          ...(typeof objname === "string" ? { columns: true } : {}),
        };
        const expected = Object.create(null);
        assert.deepEqual(parseSync("", options), expected);
        parse("", options, (err, records) => {
          if (err) return next(err);
          assert.deepEqual(records, expected);
          next();
        });
      });
    }
  });
});
