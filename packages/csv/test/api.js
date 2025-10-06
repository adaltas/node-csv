import "should";
import { generate, parse, stringify, transform } from "../lib/index.js";

describe("api", function () {
  it("generate", function (next) {
    generate(
      { length: 1, columns: 1, seed: 1, encoding: "utf8" },
      (err, data) => {
        if (!err) data.should.eql("OMH");
        next(err);
      },
    );
  });

  it("parse", function (next) {
    parse("abc,def", (err, data) => {
      if (!err) data.should.eql([["abc", "def"]]);
      next(err);
    });
  });

  it("stringify", function (next) {
    stringify([["abc", "def"]], (err, data) => {
      if (!err) data.should.eql("abc,def\n");
      next(err);
    });
  });

  it("transform", function (next) {
    transform(
      [["abc", "def"]],
      (record) => {
        record.push(record.shift());
        return record;
      },
      (err, output) => {
        if (!err) output.should.eql([["def", "abc"]]);
        next(err);
      },
    );
  });
});
