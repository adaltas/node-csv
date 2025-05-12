import "should";
import { generate } from "../lib/index.js";

describe("event end", function () {
  it("with fixed_size", function (next) {
    let count = 0;
    let ended = false;
    const generator = generate();
    generator.on("readable", () => {
      while (generator.read()) {
        ended.should.be.false();
        if (count++ === 100) {
          ended = true;
          generator.end();
        }
      }
    });
    generator.on("error", next);
    generator.on("end", next);
  });
});
