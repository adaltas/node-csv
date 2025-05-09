import "should";
import { generate } from "csv-generate";
import { transform } from "../lib/index.js";

describe("api.callback", function () {
  it("input is data", function (next) {
    const data = Array.from({ length: 100 }, (_, i) => i);
    transform(
      data,
      function (record) {
        return { value: record };
      },
      function (err, result) {
        if (!err) {
          result.length.should.eql(100);
          result[0].should.eql({ value: 0 });
        }
        next(err);
      },
    );
  });

  it("input is a readable stream", function (next) {
    generate({
      length: 1000,
      objectMode: true,
      seed: 1,
      columns: 2,
    }).pipe(
      transform(
        function (record) {
          return { value: record };
        },
        function (err, result) {
          if (!err) {
            result.length.should.eql(1000);
            result[0].should.eql({ value: ["OMH", "ONKCHhJmjadoA"] });
          }
          next(err);
        },
      ),
    );
  });
});
