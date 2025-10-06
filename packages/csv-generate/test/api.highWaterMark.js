import "should";
import { generate } from "../lib/index.js";

describe("api highWaterMark", function () {
  it("honors option", function (next) {
    const values = [];
    const generator = generate({ length: 100, highWaterMark: 100 });
    generator.on("readable", () => {
      let row;
      while ((row = generator.read())) {
        values.push(row.length);
      }
    });
    generator.on("error", next);
    generator.on("end", () => {
      values.shift();
      values.pop();
      for (const value of values) {
        value.should.be.within(100, 250);
      }
      next();
    });
  });
});
