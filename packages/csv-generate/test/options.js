import "should";
import { generate } from "../lib/index.js";

describe("Options", function () {
  it("no options with default", function (next) {
    this.timeout(1000000);
    let count = 0;
    const generator = generate();
    generator.on("readable", () => {
      while (generator.read()) {
        if (count++ === 100) {
          generator.end();
        }
      }
    });
    generator.on("error", next);
    generator.on("end", next);
  });
});
