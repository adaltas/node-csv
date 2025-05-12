import "should";
import { generate, Options } from "../lib/sync.js";

describe("API Types", () => {
  describe("usage", () => {
    it("sync with options as number", () => {
      const generator: string = generate(1);
      generator.should.be.a.String();
    });

    it("sync with options in string mode", () => {
      const generator: string = generate({ length: 1 });
      generator.should.be.a.String();
    });

    it("sync with options in object mode", () => {
      const generator: Array<Array<string>> = generate({
        length: 1,
        objectMode: true,
      });
      generator.should.be.an.Array();
    });
  });

  describe("types", () => {
    it("generate", () => {
      const generator: string = generate(1);
      return generator;
    });
    it("Options", () => {
      const options: Options = {
        columns: 1,
      };
      return options;
    });
  });
});
