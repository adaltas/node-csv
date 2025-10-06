import "should";
import { generate } from "../lib/index.js";
import type { Options, Generator } from "../lib/index.js";

describe("API Types", function () {
  describe("Initialisation", function () {
    it("stream", function () {
      // With callback
      const generator: Generator = generate();
      generator.destroy();
      generator.should.be.an.Object();
      // With callback
      generate((err, records) => err || records).destroy();
      // With options + callback
      generate({ length: 1 }, (err, records) => err || records);
    });
  });

  describe("Generator", function () {
    it("Expose options", function () {
      const generator: Generator = generate();
      const options: Options = generator.options;
      const keys = Object.keys(options);
      keys
        .sort()
        .should.eql([
          "columns",
          "delimiter",
          "duration",
          "encoding",
          "end",
          "eof",
          "fixedSize",
          "length",
          "maxWordLength",
          "rowDelimiter",
          "seed",
          "sleep",
        ]);
    });

    it("Receive Callback", function (next) {
      generate({ length: 3 }, function (err: Error | undefined, data: object) {
        if (err !== undefined) {
          data.should.be.an.Object();
        }
        next(err);
      });
    });
  });

  describe("Options", function () {
    it("columns", function () {
      const options: Options = {};
      options.columns = 8;
      options.columns = [
        "ascii",
        "bool",
        "int",
        ({ options, state }) => options.delimiter + "ok" + state.start_time,
      ];
    });

    it("delimiter", function () {
      const options: Options = {};
      options.delimiter = "|";
    });

    it("duration", function () {
      const options: Options = {};
      options.duration = 1000;
    });

    it("encoding", function () {
      const options: Options = {};
      options.encoding = "utf8";
    });

    it("end", function () {
      const options: Options = {};
      options.end = 1000;
      options.end = new Date();
    });

    it("eof", function () {
      const options: Options = {};
      options.eof = true;
      options.eof = "\n";
    });

    it("fixed_size", function () {
      const options: Options = {};
      options.fixed_size = true;
    });

    it("high_water_mark", function () {
      const options: Options = {};
      options.high_water_mark = 1024;
    });

    it("length", function () {
      const options: Options = {};
      options.length = 100;
    });

    it("max_word_length", function () {
      const options: Options = {};
      options.length = 10;
    });

    it("object_mode", function () {
      const options: Options = {};
      options.object_mode = true;
    });

    it("row_delimiter", function () {
      const options: Options = {};
      options.row_delimiter = ";";
    });

    it("seed", function () {
      const options: Options = {};
      options.seed = 10;
    });

    it("sleep", function () {
      const options: Options = {};
      options.sleep = 1000;
    });
  });
});
