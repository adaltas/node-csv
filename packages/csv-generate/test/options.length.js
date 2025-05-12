import "should";
import { generate } from "../lib/index.js";

describe("Option `length`", function () {
  it("raw text", function (next) {
    this.timeout(1000000);
    generate(
      {
        length: 20,
        encoding: "ascii",
      },
      (err, data) => {
        if (err) return next(err);
        data.split("\n").length.should.eql(20);
        next();
      },
    );
  });

  it("object", function (next) {
    this.timeout(1000000);
    generate(
      {
        objectMode: true,
        length: 20,
      },
      (err, data) => {
        if (err) return next(err);
        data.length.should.eql(20);
        next();
      },
    );
  });
});
