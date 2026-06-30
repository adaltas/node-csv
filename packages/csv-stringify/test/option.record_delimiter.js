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
  it("quote a field that would fuse with a multi-character record delimiter", function (next) {
    // The last field "a#" + record delimiter "##" emits "a###", which parse
    // re-tokenizes as a record boundary, so the field must be quoted.
    stringify(
      [["x", "a#"]],
      { record_delimiter: "##", eof: false },
      (err, data) => {
        if (err) return next(err);
        data.toString().should.eql('x,"a#"');
        next();
      },
    );
  });
  it("quote a field containing a bare carriage return", function (next) {
    // `parse` treats a lone CR as a record delimiter under its default
    // auto-detection, so a field holding a CR must be quoted to round-trip even
    // though it does not contain the default "\n" record delimiter.
    stringify([["x\ry", "z"]], { eof: false }, (err, data) => {
      if (err) return next(err);
      data.toString().should.eql('"x\ry",z');
      next();
    });
  });
});
