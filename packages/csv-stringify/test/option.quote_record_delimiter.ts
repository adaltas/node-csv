import { stringify } from "../lib/index.js";

describe("Option `quote_record_delimiter`", function () {
  it("quotes a field containing a carriage return", function (next) {
    stringify([["a\rb"]], { eof: false }, (err, data) => {
      if (err) return next(err);
      data.should.eql('"a\rb"');
      next();
    });
  });

  it("quotes a field containing a line feed", function (next) {
    stringify([["a\nb"]], { eof: false }, (err, data) => {
      if (err) return next(err);
      data.should.eql('"a\nb"');
      next();
    });
  });

  it("quotes a field containing a carriage return and line feed", function (next) {
    stringify([["a\r\nb"]], { eof: false }, (err, data) => {
      if (err) return next(err);
      data.should.eql('"a\r\nb"');
      next();
    });
  });

  it("defaults to false when `record_delimiter` is provided", function (next) {
    stringify(
      [["a\rb"]],
      { record_delimiter: "::", eof: false },
      (err, data) => {
        if (err) return next(err);
        data.should.eql("a\rb");
        next();
      },
    );
  });

  it("disabled with a default `record_delimiter`", function (next) {
    stringify(
      [["a\rb"]],
      { quote_record_delimiter: false, eof: false },
      (err, data) => {
        if (err) return next(err);
        data.should.eql("a\rb");
        next();
      },
    );
  });

  it("enabled with a custom `record_delimiter`", function (next) {
    stringify(
      [["a\rb"]],
      { record_delimiter: "::", quote_record_delimiter: true, eof: false },
      (err, data) => {
        if (err) return next(err);
        data.should.eql('"a\rb"');
        next();
      },
    );
  });

  it("quotes the configured `record_delimiter` when disabled", function (next) {
    stringify(
      [["a::b"]],
      { record_delimiter: "::", quote_record_delimiter: false, eof: false },
      (err, data) => {
        if (err) return next(err);
        data.should.eql('"a::b"');
        next();
      },
    );
  });

  it("applies to a `record_delimiter` returned by cast", function (next) {
    // The emitted delimiter stays the global one, so `\r` is still quoted
    stringify(
      [["a\rb"], ["c"]],
      {
        cast: { string: (value) => ({ value, record_delimiter: "::" }) },
        eof: false,
      },
      (err, data) => {
        if (err) return next(err);
        data.should.eql('"a\rb"\nc');
        next();
      },
    );
  });

  it("quotes a `record_delimiter` returned by cast", function (next) {
    stringify(
      [["a::b"]],
      {
        cast: { string: (value) => ({ value, record_delimiter: "::" }) },
        eof: false,
      },
      (err, data) => {
        if (err) return next(err);
        data.should.eql('"a::b"');
        next();
      },
    );
  });

  it("defaults to false in cast when `record_delimiter` is provided", function (next) {
    stringify(
      [["a\rb"]],
      {
        record_delimiter: ";;",
        cast: { string: (value) => ({ value, record_delimiter: "::" }) },
        eof: false,
      },
      (err, data) => {
        if (err) return next(err);
        data.should.eql("a\rb");
        next();
      },
    );
  });
});
