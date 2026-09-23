import "should";
import { stringify, normalize_options } from "../lib/sync.js";

describe("Option `quote_record_delimiter`", function () {
  it("default to `true`", function () {
    let options;
    [, options] = normalize_options({});
    options.quote_record_delimiter.should.eql(true);
    [, options] = normalize_options({ quote_record_delimiter: false });
    options.quote_record_delimiter.should.eql(false);
  });

  it("quotes a field containing a carriage return", function () {
    stringify([["a\rb"]], { eof: false }).should.eql('"a\rb"');
    stringify([["a\rb"]], {
      eof: false,
      quote_record_delimiter: true,
    }).should.eql('"a\rb"');
    stringify([["a\rb"]], {
      eof: false,
      quote_record_delimiter: false,
    }).should.eql("a\rb");
  });

  it("quotes a field containing a line feed", function () {
    // quote_record_delimiter is `false`
    // but the input contains the default record_delimiter `\n`
    // which cause the `emits_separator` function to return true
    stringify([["a\nb"]], { eof: false }).should.eql('"a\nb"');
    stringify([["a\nb"]], {
      eof: false,
      quote_record_delimiter: false,
    }).should.eql('"a\nb"');
    stringify([["a\nb"]], {
      eof: false,
      quote_record_delimiter: true,
    }).should.eql('"a\nb"');
  });

  it("quotes a field containing a carriage return and line feed", function () {
    // quote_record_delimiter is `false`
    // but the input **partially** contains the default record_delimiter `\n`
    // which cause the `emits_separator` function to return true
    stringify([["a\r\nb"]], { eof: false }).should.eql('"a\r\nb"');
    stringify([["a\r\nb"]], {
      eof: false,
      quote_record_delimiter: false,
    }).should.eql('"a\r\nb"');
    stringify([["a\r\nb"]], {
      eof: false,
      quote_record_delimiter: true,
    }).should.eql('"a\r\nb"');
  });

  describe("with `record_delimiter`", function () {
    it("defaults to false when `record_delimiter` is provided", function () {
      let options;
      [, options] = normalize_options({ record_delimiter: "::" });
      options.quote_record_delimiter.should.eql(false);
      [, options] = normalize_options({
        quote_record_delimiter: true,
        record_delimiter: "::",
      });
      options.quote_record_delimiter.should.eql(true);
    });

    it("quotes the configured `record_delimiter` when disabled", function () {
      stringify([["a::b"]], {
        record_delimiter: "::",
        quote_record_delimiter: false,
        eof: false,
      }).should.eql('"a::b"');
    });
  });
  describe("with `cast`", function () {
    it("applies to a `record_delimiter` returned by cast", function () {
      // The emitted delimiter stays the global one, so `\r` is still quoted
      stringify([["a\rb"], ["c"]], {
        cast: {
          string: (value) => ({
            value,
            quote_record_delimiter: true,
            record_delimiter: "::",
          }),
        },
        eof: false,
      }).should.eql('"a\rb"\nc');
    });

    it("quotes a `record_delimiter` returned by cast", function () {
      stringify([["a::b"]], {
        cast: { string: (value) => ({ value, record_delimiter: "::" }) },
        eof: false,
      }).should.eql('"a::b"');
    });

    it("defaults to false in cast when `record_delimiter` is provided", function () {
      stringify([["a\rb"]], {
        record_delimiter: ";;",
        cast: { string: (value) => ({ value, record_delimiter: "::" }) },
        eof: false,
      }).should.eql("a\rb");
    });
  });
});
