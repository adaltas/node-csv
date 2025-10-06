import "should";
import { generate } from "../lib/index.js";

describe("Option `row_delimiter`", function () {
  it("default to unix style", function (next) {
    generate({ length: 10, encoding: "ascii" }, (err, data) => {
      if (!err) {
        data.split("\n").length.should.eql(10);
      }
      next(err);
    });
  });

  it("accept multiple chars", function (next) {
    generate(
      { row_delimiter: "abcd", length: 10, encoding: "ascii" },
      (err, data) => {
        if (!err) {
          data.split("abcd").length.should.eql(10);
        }
        next(err);
      },
    );
  });
});
