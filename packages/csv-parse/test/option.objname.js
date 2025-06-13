import "should";
import { parse } from "../lib/index.js";

describe("Option `objname`", function () {
  describe("validation", function () {
    it("does not accept boolean", function () {
      (() => {
        parse("", { objname: true }, () => {});
      }).should.throw(
        "Invalid Option: objname must be a string or a buffer, got true",
      );
    });
  });
});
