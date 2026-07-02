import "should";
import { stringify } from "../lib/index.js";

describe("Option `escape`", function () {
  it("validation", function () {
    (() => {
      stringify([], { escape: true });
    }).should.throw(
      "Invalid Option: escape must be a buffer or a string, got true",
    );
    (() => {
      stringify([], { escape: false });
    }).should.throw(
      "Invalid Option: escape must be a buffer or a string, got false",
    );
    (() => {
      stringify([], { escape: 123 });
    }).should.throw(
      "Invalid Option: escape must be a buffer or a string, got 123",
    );
    (() => {
      stringify([], { escape: "XX" });
    }).should.throw(
      "Invalid Option: escape must be one character, got 2 characters",
    );
  });
});
