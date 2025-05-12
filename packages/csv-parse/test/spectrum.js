import "should";
import { default as spectrum } from "csv-spectrum";
import { default as each } from "each";
import { parse } from "../lib/sync.js";

describe("spectrum", function () {
  it("pass all tests", function (next) {
    spectrum((err, tests) => {
      each(tests, (test) => {
        if (test.name === "simple") return; // See https://github.com/maxogden/csv-spectrum/commit/ec45e96a79661d7bd87f6becbb845b30f11accde
        if (test.name === "location_coordinates") return; // See https://github.com/max-mapper/csv-spectrum/issues/20
        const records = parse(test.csv.toString(), {
          columns: true,
          relax_quotes: true,
        });
        records.should.eql(JSON.parse(test.json.toString()));
      }).then(() => next(), next);
    });
  });
});
