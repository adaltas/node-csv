import "should";
import { parse } from "../lib/index.js";

describe("Option `comment_no_infix`", function () {
  it("validation", function () {
    parse("", { comment_no_infix: undefined }, () => {});
    parse("", { comment_no_infix: null }, () => {});
    parse("", { comment_no_infix: false }, () => {});
    parse("", { comment_no_infix: true }, () => {});
  });

  it("with `true`, field starting with comment", function (next) {
    parse(
      "a,#,c",
      {
        comment: "#",
        comment_no_infix: true,
      },
      (err, records) => {
        if (!err) {
          records.should.eql([["a", "#", "c"]]);
        }
        next(err);
      },
    );
  });

  it("with `true`, field not starting with comment", function (next) {
    parse(
      "a,b#,c",
      {
        comment: "#",
        comment_no_infix: true,
      },
      (err, records) => {
        if (!err) {
          records.should.eql([["a", "b#", "c"]]);
        }
        next(err);
      },
    );
  });

  it("with `false`", function (next) {
    parse(
      "a,b#,c",
      {
        comment: "#",
        comment_no_infix: false,
      },
      (err, records) => {
        if (!err) {
          records.should.eql([["a", "b"]]);
        }
        next(err);
      },
    );
  });
});
