import "should";
import { generate } from "csv-generate";
import { transform } from "../lib/index.js";

describe("handler.mode.sync.error", function () {
  it("catch using stream api", function (next) {
    const transformer = transform((record) => {
      record;
      throw new Error("Custom Error");
    });
    transformer.on("error", (err) => {
      err.message.should.eql("Custom Error");
      next();
    });
    transformer.on("finish", () => {
      next(new Error("Should not be called"));
    });
    transformer.write(["trigger 1", "trigger 2"]);
  });

  it("catch using pipe api", function (next) {
    const generator = generate({
      length: 1000,
      objectMode: true,
      seed: 1,
      headers: 2,
    });
    const transformer = generator.pipe(
      transform((record) => {
        record;
        throw new Error("Custom Error");
      }),
    );
    transformer.on("error", (err) => {
      err.message.should.eql("Custom Error");
      next();
    });
    transformer.on("finish", () => {
      next(new Error("Should not be called"));
    });
    transformer.write(["trigger 1", "trigger 2"]);
  });

  it("catch using callback api", function (next) {
    transform(
      [["trigger 1"], ["trigger 2"], ["trigger 3"]],
      (record) => {
        record;
        throw new Error("Custom Error");
      },
      (err) => {
        // thrown multiple times for now
        err.message.should.eql("Custom Error");
        next();
      },
    );
  });
});
