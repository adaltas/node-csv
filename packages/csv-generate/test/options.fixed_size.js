import "should";
import { generate } from "../lib/index.js";

describe("Option `fixed_size`", function () {
  it("with fixed_size", function (next) {
    let count = 0;
    const generator = generate({
      fixed_size: true,
      highWaterMark: 1024,
    });
    generator.on("readable", () => {
      let data;
      while ((data = generator.read())) {
        // First generated data is twice the high water mark, don't know why
        data.length.should.eql(1024);
        if (count++ === 100) {
          generator.end();
        }
      }
    });
    generator.on("error", next);
    generator.on("end", next);
  });
});
