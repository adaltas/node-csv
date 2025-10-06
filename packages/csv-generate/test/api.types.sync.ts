import "should";
import { generate } from "../lib/sync.js";
import type { Options } from "../lib/sync.js";

describe("API Types", function () {
  describe("usage", function () {
    it("sync with options as number", function () {
      const generator: string = generate(1);
      generator.should.be.a.String();
    });

    it("sync with options in string mode", function () {
      const generator: string = generate({ length: 1 });
      generator.should.be.a.String();
    });

    it("sync with options in object mode", function () {
      const generator: Array<Array<string>> = generate({
        length: 1,
        objectMode: true,
      });
      generator.should.be.an.Array();
    });
  });

  describe("types", function () {
    it("generate", function () {
      const generator: string = generate(1);
      return generator;
    });

    it("Options", function () {
      const options: Options = {
        columns: 1,
      };
      return options;
    });
  });
});
