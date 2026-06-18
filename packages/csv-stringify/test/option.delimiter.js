import "should";
import { stringify } from "../lib/index.js";

describe("Option `delimiter`", function () {
  it("validation", function () {
    (() => {
      stringify([], { delimiter: true });
    }).should.throw({
      code: "CSV_OPTION_DELIMITER_INVALID_TYPE",
      message: "option `delimiter` must be a buffer or a string, got true",
    });
    (() => {
      stringify([], { delimiter: false });
    }).should.throw({
      code: "CSV_OPTION_DELIMITER_INVALID_TYPE",
      message: "option `delimiter` must be a buffer or a string, got false",
    });
    (() => {
      stringify([], { delimiter: 123 });
    }).should.throw({
      code: "CSV_OPTION_DELIMITER_INVALID_TYPE",
      message: "option `delimiter` must be a buffer or a string, got 123",
    });
  });
  it("quote a field that would fuse with a multi-character delimiter", function (next) {
    // "a:" + "::" emits "a:::", which parse re-tokenizes as two fields, so the
    // field must be quoted to round-trip (RFC 4180 §2.6, generalized to
    // multi-character delimiters).
    stringify([["a:", "b"]], { delimiter: "::", eof: false }, (err, data) => {
      if (err) return next(err);
      data.toString().should.eql('"a:"::b');
      next();
    });
  });
  it("does not quote when the tail cannot fuse with the delimiter", function (next) {
    // "a:" + ":x" emits "a::x"; ":x" never starts inside "a:", so no quoting.
    stringify([["a:", "b"]], { delimiter: ":x", eof: false }, (err, data) => {
      if (err) return next(err);
      data.toString().should.eql("a::xb");
      next();
    });
  });
});
