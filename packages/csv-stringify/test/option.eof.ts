import "should";
import { stringify } from "../lib/index.js";

describe("Option `eof`", function () {
  it("print line break when true", function (next) {
    stringify(
      [
        ["a", "b", "c"],
        ["1", "2", "3"],
      ],
      { eof: true },
      (err, data) => {
        if (err) return next(err);
        data.should.eql("a,b,c\n1,2,3\n");
        next();
      },
    );
  });

  it("dont print line break when false", function (next) {
    stringify(
      [
        ["a", "b", "c"],
        ["1", "2", "3"],
      ],
      { eof: false },
      (err, data) => {
        if (err) return next(err);
        data.should.eql("a,b,c\n1,2,3");
        next();
      },
    );
  });
});
