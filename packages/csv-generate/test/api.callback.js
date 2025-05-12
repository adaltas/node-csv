import "should";
import { generate } from "../lib/index.js";

describe("api callback", function () {
  it("receive a buffer", function (next) {
    generate({ length: 3 }, (err, data) => {
      if (!err) Buffer.isBuffer(data).should.be.true();
      next();
    });
  });

  it("receive a string if encoding is defined", function (next) {
    generate({ length: 3, encoding: "utf8" }, (err, data) => {
      if (!err) (typeof data === "string").should.be.true();
      next();
    });
  });
});
