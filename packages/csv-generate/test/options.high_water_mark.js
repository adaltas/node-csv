import "should";
import { generate } from "../lib/index.js";

describe("Option `high_water_mark`", function () {
  it("generate slightly larger buffer lengths", function (next) {
    let count = 0;
    const generator = generate({
      fixed_size: true,
      highWaterMark: 64,
    });
    generator.on("readable", () => {
      let data;
      while ((data = generator.read())) {
        data.length.should.be.within(64, 64 * 3);
        if (count++ === 100) {
          generator.end();
        }
      }
    });
    generator.on("error", next);
    generator.on("end", next);
  });
});
