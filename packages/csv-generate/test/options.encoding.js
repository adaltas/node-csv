import "should";
import { generate } from "../lib/index.js";

describe("Option `encoding`", function () {
  it("generate buffer by default", function (next) {
    generate({ length: 1 }, (err, data) => {
      if (!err) {
        Buffer.isBuffer(data).should.be.true();
      }
      next(err);
    });
  });

  it("generate string if defined", function (next) {
    generate({ length: 1, encoding: "ascii" }, (err, data) => {
      if (!err) {
        data.should.be.a.String();
      }
      next(err);
    });
  });
});
