import "should";
import should from "should";
import { stringify } from "../lib/index.js";

describe("Option `quoted_match`", function () {
  it("default to `null`", function (next) {
    const stringifier = stringify([["abc", "def"]], () => {
      should(stringifier.options.quoted_match).be.null();
      next();
    });
  });

  it("a string", function (next) {
    stringify(
      [["abc", "def"]],
      { quoted_match: "e", eof: false },
      (err, data) => {
        if (!err) {
          data.should.eql('abc,"def"');
        }
        next(err);
      },
    );
  });

  it("a regex", function (next) {
    stringify(
      [["abcd", "efg"]],
      { quoted_match: /^\w{3}$/, eof: false },
      (err, data) => {
        if (!err) {
          data.should.eql('abcd,"efg"');
        }
        next(err);
      },
    );
  });

  it("an array", function (next) {
    stringify(
      [["ab", "cd", "efg"]],
      { quoted_match: ["d", /^\w{3}$/], eof: false },
      (err, data) => {
        if (!err) {
          data.should.eql('ab,"cd","efg"');
        }
        next(err);
      },
    );
  });

  it("a global regex matches every field (fix #498)", function (next) {
    // A global regex carries `lastIndex` from one call to the next, and the
    // same regex object is applied to every field of every record.
    stringify(
      [
        ["1", "2"],
        ["3", "4"],
      ],
      { quoted_match: /\d/g, eof: false },
      (err, data) => {
        if (!err) {
          data.should.eql('"1","2"\n"3","4"'); // was equal to `"1",2\n"3",4`
        }
        next(err);
      },
    );
  });

  it("a global regex matches every field of a record (fix #498)", function (next) {
    stringify(
      [["1", "2", "3", "4"]],
      { quoted_match: [/\d/g], eof: false },
      (err, data) => {
        if (!err) {
          data.should.eql('"1","2","3","4"'); // was equal to `"1",2,"3",4`
        }
        next(err);
      },
    );
  });

  it("a global regex does not consume the caller's `lastIndex` (fix #498)", function (next) {
    const quoted_match = /\d/g;
    quoted_match.lastIndex = 1;
    stringify([["1"], ["2"]], { quoted_match, eof: false }, (err, data) => {
      if (!err) {
        data.should.eql('"1"\n"2"'); // was equal to `1\n"2"`
        quoted_match.lastIndex.should.eql(1);
      }
      next(err);
    });
  });

  it('an empty string regex with no other "quoted" options (#344)', function (next) {
    stringify(
      [["a", null, undefined, "", "b"]],
      { quoted_match: /^$/, eof: false },
      (err, data) => {
        if (!err) {
          data.should.eql('a,,,"",b');
        }
        next(err);
      },
    );
  });

  it('an empty string regex with all other "quoted" options set to false (#344)', function (next) {
    stringify(
      [["a", null, undefined, "", "b"]],
      {
        quoted: false,
        quoted_empty: false,
        quoted_string: false,
        quoted_match: /^$/,
        eof: false,
      },
      (err, data) => {
        if (!err) {
          data.should.eql('a,,,"",b');
        }
        next(err);
      },
    );
  });

  it('an empty string regex has higher priority than the "quoted" option', function (next) {
    stringify(
      [["a", null, undefined, "", "b"]],
      { quoted: true, quoted_match: /^$/, eof: false },
      (err, data) => {
        if (!err) {
          data.should.eql('"a",,,"","b"');
        }
        next(err);
      },
    );
  });

  it("an empty string regex does not conflict with quoted_string set to true", function (next) {
    stringify(
      [["a", null, undefined, "", "b"]],
      { quoted_string: true, quoted_match: /^$/, eof: false },
      (err, data) => {
        if (!err) {
          data.should.eql('"a",,,"","b"');
        }
        next(err);
      },
    );
  });

  it("an empty string regex does not conflict with quoted_empty set to true", function (next) {
    stringify(
      [["a", null, undefined, "", "b"]],
      { quoted_empty: true, quoted_match: /^$/, eof: false },
      (err, data) => {
        if (!err) {
          data.should.eql('a,"","","",b');
        }
        next(err);
      },
    );
  });
});
