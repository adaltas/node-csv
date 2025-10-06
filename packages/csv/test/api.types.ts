import "should";
import { generate, parse, parser, stringify, transform } from "../lib/index.js";

describe("API Types", function () {
  describe("Initialisation", function () {
    it("generate", function () {
      // with options + handler
      generate(
        { length: 1 },
        (err: Error | undefined, records: Array<Array<string>>) =>
          err || records,
      );
    });

    it("parse", function () {
      // With input + handler
      parse(
        "abc,def",
        {},
        (err: parser.CsvError | undefined, records: Array<Array<string>>) =>
          err?.message || records,
      );
    });

    it("stringify", function () {
      // With handler
      stringify((err: Error | undefined, output: string) => err || output);
    });

    it("transform", function () {
      // With handler
      const transformer = transform((record) => record);
      transformer.should.be.an.Object(); // Disable unused variable warning
      // With handler + callback
      transform(
        (record) => record,
        (err, records) => err || records,
      );
      // With records + handler
      transform(["record"], (record) => record);
      // With options + handler
      transform({ consume: true }, (record) => record);
      // With records + options + handler
      transform(["record"], { consume: true }, (record) => record);
      // With records + options + handler + callback
      transform(
        ["record"],
        { consume: true },
        (record) => record,
        (err, records) => err || records,
      );
    });
  });
});
