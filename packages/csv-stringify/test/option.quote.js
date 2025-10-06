import "should";
import { stringify } from "../lib/index.js";

describe("Option `quote`", function () {
  it("validation", function () {
    (() => {
      stringify([], { quote: 123 });
    }).should.throw(
      "option `quote` must be a boolean, a buffer or a string, got 123",
    );
  });
});
