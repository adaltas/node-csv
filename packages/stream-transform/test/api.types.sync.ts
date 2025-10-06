import "should";
import { transform, Options } from "../lib/sync.js";

describe("api.types", function () {
  it("sync", function () {
    // With records + handler
    const transformer: string[] = transform(["record"], (record) => record);
    transformer.should.be.an.Array();
    // With records + options + handler
    transform(["record"], { consume: true }, (record) => record);
  });

  it("Options", function () {
    (options: Options) => {
      const consume: boolean | undefined = options.consume;
      const parallel: number | undefined = options.parallel;
      const params: number = options.params;
      return { consume, parallel, params };
    };
  });
});
