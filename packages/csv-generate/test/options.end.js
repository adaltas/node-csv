import "should";
import { generate } from "../lib/index.js";

describe("Option `end`", function () {
  it("as millisecond", function (next) {
    this.timeout(1000000);
    generate({ end: Date.now() + 1000, encoding: "ascii" }, (err, data) => {
      if (err) return next(err);
      data.split("\n").length.should.be.above(10000);
      next();
    });
  });

  it("as millisecond dont generate record if inferior to now", function (next) {
    this.timeout(1000000);
    generate({ end: Date.now() - 1, encoding: "ascii" }, (err, data) => {
      if (err) return next(err);
      data.should.eql("");
      next();
    });
  });

  it("as date", function (next) {
    this.timeout(1000000);
    generate(
      { end: new Date(Date.now() + 1000), encoding: "ascii" },
      (err, data) => {
        if (err) return next(err);
        data.split("\n").length.should.be.above(10000);
        next();
      },
    );
  });
});
