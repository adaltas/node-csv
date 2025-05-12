import "should";
import csv, { generate, parse, stringify, transform } from "../lib/sync.js";

describe("API Types", () => {
  describe("usage", () => {
    it("generate", () => {
      // with options + handler
      const output: string = generate(1);
      return output;
    });

    it("parse", () => {
      const output: string = parse("");
      return output;
    });

    it("stringify", () => {
      const output: string = stringify([]);
      return output;
    });

    it("transform", () => {
      const output: any = transform([], () => {});
      return output;
    });
  });

  describe("usage", () => {
    it("csv.generate", () => {
      const options: csv.generator.Options = {};
      return options;
    });

    it("csv.parse", () => {
      const options: csv.parser.Options = {};
      return options;
    });

    it("csv.stringifier", () => {
      const options: csv.stringifier.Options = {};
      return options;
    });

    it("csv.transform", () => {
      const options: csv.transformer.Options = {};
      return options;
    });
  });
});
