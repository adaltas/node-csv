import "should";
import { parse } from "../lib/index.js";

describe("Option `encoding`", function () {
  describe("validation & normalization", function () {
    it("integer throw invalid encoding", function () {
      (() => {
        parse("whocare", { encoding: 666 }, () => {});
      }).should.throw({
        code: "CSV_INVALID_OPTION_ENCODING",
        message:
          "Invalid option encoding: encoding must be a string or null to return a buffer, got 666",
      });
    });
  });
});
