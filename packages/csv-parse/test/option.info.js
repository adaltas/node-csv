import { parse } from "../lib/index.js";

describe("Option `info`", function () {
  describe("validation", function () {
    it("check the columns value", function () {
      (() => {
        parse("", { info: "ok" }, () => {});
      }).should.throw('Invalid Option: info must be true, got "ok"');
    });
  });
});
