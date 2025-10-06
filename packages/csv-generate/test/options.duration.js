import "should";
import { generate } from "../lib/index.js";

describe("option `duration`", function () {
  it("as millisecond", function (next) {
    this.timeout(1000000);
    const start = Date.now();
    generate({ duration: 1000, encoding: "ascii" }, (err, data) => {
      const end = Date.now();
      if (!err) {
        (end - start).should.be.within(1000, 1100);
        data.split("\n").length.should.be.above(10000);
      }
      next(err);
    });
  });
});
