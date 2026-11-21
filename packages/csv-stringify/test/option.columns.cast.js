import "should";
import { stringify } from "../lib/sync.js";

describe("Option `columns.cast` validation", function () {
  it("requires a function when provided", function () {
    for (const cast of [null, true, false, 0, "", {}]) {
      (() => stringify([], { columns: [{ key: "a", cast }] })).should.throw(
        'Invalid column definition: property "cast" must be a function',
      );
    }
  });

  it("uses the existing cast return value validation", function () {
    (() =>
      stringify([[1]], {
        columns: [{ key: "a", cast: () => 42 }],
      })).should.throw(
      "Invalid Casting Value: returned value must return a string, an object, null or undefined, got 42",
    );
  });
});
