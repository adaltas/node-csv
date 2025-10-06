import "should";
import csv, { generate, parse, stringify, transform } from "../lib/sync.js";

describe("API Types", function () {
  describe("usage with named export", function () {
    it("generate", function () {
      // with options + handler
      const output: string = generate(1);
      return output;
    });

    it("parse", function () {
      const output: string[][] = parse("");
      return output;
    });

    it("stringify", function () {
      const output: string = stringify([]);
      return output;
    });

    it("transform", function () {
      const output: void[] = transform([], () => {});
      return output;
    });
  });

  describe("usage with default export", function () {
    it("csv.generate", function () {
      const options: csv.generator.Options = {};
      return options;
    });

    it("csv.parse", function () {
      const options: csv.parser.Options = {};
      return options;
    });

    it("csv.stringifier", function () {
      const options: csv.stringifier.Options = {};
      return options;
    });

    it("csv.transform", function () {
      const options: csv.transformer.Options = {};
      return options;
    });
  });
});
