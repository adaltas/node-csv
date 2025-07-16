import "should";
import { parse } from "../lib/index.js";

describe("Option `cast_date`", function () {
  it("true", function (next) {
    parse(
      "2000-01-01,date1\n2050-11-27,date2",
      {
        cast: true,
        cast_date: true,
      },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([
          [new Date("2000-01-01T00:00:00.000Z"), "date1"],
          [new Date("2050-11-27T00:00:00.000Z"), "date2"],
        ]);
        next();
      },
    );
  });

  it("as a function", function (next) {
    // Current implementation rely on `isNaN(Date.parse(value))`
    // While it return `NaN` in Firefox, Node.js return a timestamp for
    // `Date.parse('Test 1')`
    parse(
      "2000-01-01\n2050-11-27",
      {
        cast: true,
        cast_date: (value, context) => {
          return new Date(
            new Date(value).getTime() + context.lines * 60 * 60 * 1000,
          );
        },
      },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([
          [new Date("2000-01-01T01:00:00.000Z")],
          [new Date("2050-11-27T02:00:00.000Z")],
        ]);
        next();
      },
    );
  });

  it("value end with space and number (issue #342)", function (next) {
    // Current implementation rely on `isNaN(Date.parse(value))`
    // While it return `NaN` in Firefox, Node.js return a timestamp for
    // `node -e 'console.info(Date.parse("Test 1"))'`
    parse(
      "Test 1",
      {
        cast: true,
        cast_date: true,
      },
      (err, [[record]]) => {
        if (err) return next(err);
        (record as unknown as Date)
          .toISOString()
          .should.match(/^\d{4}-\d{2}-\d{2}/);
        next();
      },
    );
  });
});
