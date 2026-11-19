import "should";
import { parse } from "../lib/index.js";

describe("Option `to_line`", function () {
  it("validation", function () {
    (() => {
      parse("", { to_line: "0" }, () => {});
    }).should.throw(
      'Invalid Option: to_line must be a positive integer greater than 0, got "0"',
    );
    (() => {
      parse("", { to_line: true }, () => {});
    }).should.throw("Invalid Option: to_line must be an integer, got true");
    (() => {
      parse("", { to_line: false }, () => {});
    }).should.throw("Invalid Option: to_line must be an integer, got false");
    (() => {
      parse("", { to_line: "oh no" }, () => {});
    }).should.throw('Invalid Option: to_line must be an integer, got "oh no"');
  });

  it("count a CRLF inside a quoted field as one line", function (next) {
    parse('"a\r\nb",1\r\nc,2\r\nd,3', { to_line: 3 }, (err, records) => {
      if (err) return next(err);
      records.should.eql([
        ["a\r\nb", "1"],
        ["c", "2"],
      ]);
      next();
    });
  });
});
