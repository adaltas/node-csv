import "should";
import { generate, parse, transform, stringify } from "../lib/sync.js";

describe("api sync", function () {
  it("generate", function () {
    generate({ length: 1, columns: 1, seed: 1, objectMode: true }).should.eql([
      ["OMH"],
    ]);
  });

  it("parse", function () {
    parse("abc,def").should.eql([["abc", "def"]]);
  });

  it("transform", function () {
    transform([["abc", "def"]], (record) => {
      record.push(record.shift());
      return record;
    }).should.eql([["def", "abc"]]);
  });

  it("stringify", function () {
    stringify([["abc", "def"]]).should.eql("abc,def\n");
  });
});
