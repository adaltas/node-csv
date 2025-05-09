import "should";
import { transform } from "../lib/index.js";

describe("handler", function () {
  it("context sync", function (next) {
    const transformer = transform(
      [
        ["a", "b", "c"],
        ["1", "2", "3"],
      ],
      function (record) {
        transformer.should.eql(this);
        return record;
      },
      next,
    );
  });

  it("context async", function (next) {
    const transformer = transform(
      [
        ["a", "b", "c"],
        ["1", "2", "3"],
      ],
      function (record, callback) {
        transformer.should.eql(this);
        callback(null, record);
      },
      next,
    );
  });
});
