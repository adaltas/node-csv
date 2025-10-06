import "should";
import { generate } from "../lib/index.js";

describe("Option `eof`", function () {
  it("default to trailing newline character if true", function (next) {
    generate(
      {
        eof: true,
        length: 10,
        encoding: "ascii",
      },
      (err, data) => {
        if (!err) {
          data.split("\n")[10].should.eql("");
        }
        next(err);
      },
    );
  });

  it("accept any string", function (next) {
    generate(
      {
        eof: "abcd",
        length: 10,
        encoding: "ascii",
      },
      (err, data) => {
        if (!err) {
          data.split("abcd")[1].should.eql("");
        }
        next(err);
      },
    );
  });
});
