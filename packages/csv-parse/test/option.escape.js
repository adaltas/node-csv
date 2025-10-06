import "should";
import { parse } from "../lib/index.js";

describe("Option `escape`", function () {
  describe("normalisation, coercion & validation", function () {
    it("invalid", function () {
      (() => {
        parse({ escape: 1 });
      }).should.throw(
        "Invalid Option: escape must be a buffer, a string or a boolean, got 1",
      );
    });
  });
});
