import "should";
import { stringify } from "../lib/index.js";
import { stringify as stringifySync } from "../lib/sync.js";

describe("Option `escape`", function () {
  it("regexp metacharacter escape is doubled literally", function () {
    // The escape character was interpolated into `new RegExp(escape, "g")`.
    // Metacharacters (| . * + ? ( [ { ^ $ ...) broke the doubling: "|" and
    // "." matched everywhere, "*" threw "Nothing to repeat", "$" anchored.
    // A field that must be quoted and contains the escape char must have every
    // literal escape occurrence doubled, whatever the character.
    stringifySync([["a|b,c"]], { escape: "|", eof: false }).should.eql(
      '"a||b,c"',
    );
    stringifySync([["a.b,c"]], { escape: ".", eof: false }).should.eql(
      '"a..b,c"',
    );
    (() => {
      stringifySync([["a*b,c"]], { escape: "*", eof: false });
    }).should.not.throw();
    stringifySync([["a*b,c"]], { escape: "*", eof: false }).should.eql(
      '"a**b,c"',
    );
    // "$" is also special in the replacement string, not only the pattern.
    stringifySync([["a$b,c"]], { escape: "$", eof: false }).should.eql(
      '"a$$b,c"',
    );
  });
  it("regexp metacharacter quote is doubled literally", function () {
    // Same class of bug on `new RegExp(quote, "g")` when the quote character is
    // a regexp metacharacter and appears inside the field.
    stringifySync([["a.b"]], { quote: ".", eof: false }).should.eql('.a".b.');
    stringifySync([["a|b"]], { quote: "|", escape: "\\", eof: false }).should.eql(
      "|a\\|b|",
    );
  });
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
