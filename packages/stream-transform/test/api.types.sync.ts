import "should";
import { transform, Options } from "../lib/sync.js";

describe("api.types", () => {
  it("sync", () => {
    // With records + handler
    const transformer: Array<any> = transform(["record"], (record) => record);
    transformer.should.be.an.Array();
    // With records + options + handler
    transform(["record"], { consume: true }, (record) => record);
  });

  it("Options", () => {
    (options: Options) => {
      const consume: boolean | undefined = options.consume;
      const parallel: number | undefined = options.parallel;
      const params: number = options.params;
      return { consume, parallel, params };
    };
  });
});
