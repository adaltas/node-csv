import { generate } from "csv-generate";
import { transform } from "../lib/index.js";

describe("option.params", function () {
  it("sync", function (next) {
    const generator = generate({ length: 100, objectMode: true, seed: 1 });
    const transformer = generator.pipe(
      transform(
        (record, params) => {
          params.my_key.should.eql("my value");
        },
        {
          parallel: 10,
          consume: true,
          params: { my_key: "my value" },
        },
      ),
    );
    transformer.on("error", next);
    transformer.on("finish", () => {
      next();
    });
  });

  it("async", function (next) {
    const generator = generate({ length: 100, objectMode: true, seed: 1 });
    const transformer = generator.pipe(
      transform(
        (record, callback, params) => {
          params.my_key.should.eql("my value");
          setImmediate(() => callback(null, ""));
        },
        {
          parallel: 10,
          consume: true,
          params: { my_key: "my value" },
        },
      ),
    );
    transformer.on("error", next);
    transformer.on("finish", () => {
      next();
    });
  });
});
