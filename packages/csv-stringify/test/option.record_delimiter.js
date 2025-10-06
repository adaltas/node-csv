import { stringify } from "../lib/index.js";

describe("Option `record_delimiter`", function () {
  it("validation", function () {
    (() => {
      stringify([], { record_delimiter: true });
    }).should.throw(
      "Invalid Option: record_delimiter must be a buffer or a string, got true",
    );
    (() => {
      stringify([], { record_delimiter: false });
    }).should.throw(
      "Invalid Option: record_delimiter must be a buffer or a string, got false",
    );
    (() => {
      stringify([], { record_delimiter: 123 });
    }).should.throw(
      "Invalid Option: record_delimiter must be a buffer or a string, got 123",
    );
  });
});
