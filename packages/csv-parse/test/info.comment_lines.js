import "should";
import { parse } from "../lib/index.js";

describe("info comment_lines", function () {
  it("no empty lines", function (next) {
    parse(
      "a,b,c\nd,e,f",
      {
        comment: "#",
      },
      (err, records, { comment_lines }) => {
        if (err) return next(err);
        comment_lines.should.eql(0);
        next();
      },
    );
  });

  it("comment in the middle of a line", function (next) {
    parse(
      "a,b,c\nd,e,f # comment\nh,i,j",
      {
        comment: "#",
      },
      (err, records, { comment_lines }) => {
        if (err) return next(err);
        comment_lines.should.eql(0);
        next();
      },
    );
  });

  it("single comment line", function (next) {
    parse(
      "# comment",
      {
        comment: "#",
      },
      (err, records, { comment_lines }) => {
        if (err) return next(err);
        comment_lines.should.eql(1);
        next();
      },
    );
  });

  it("single comment line with empty field", function (next) {
    parse(
      '""# comment',
      {
        comment: "#",
      },
      (err, records, { comment_lines }) => {
        if (err) return next(err);
        comment_lines.should.eql(0);
        next();
      },
    );
  });

  it("two line in the middle of dataset", function (next) {
    parse(
      "a,b,c\n# comment 1\n# comment 2\nd,e,f",
      {
        comment: "#",
        skip_empty_lines: true,
      },
      (err, records, { comment_lines }) => {
        if (err) return next(err);
        comment_lines.should.eql(2);
        next();
      },
    );
  });

  it("one line at the end of dataset", function (next) {
    parse(
      "a,b,c\nd,e,f\n# comment",
      {
        comment: "#",
      },
      (err, records, { comment_lines }) => {
        if (err) return next(err);
        comment_lines.should.eql(1);
        next();
      },
    );
  });

  it("one line at the beginning", function (next) {
    parse(
      "# comment\na,b,c\nd,e,f",
      {
        comment: "#",
      },
      (err, records, { comment_lines }) => {
        if (err) return next(err);
        comment_lines.should.eql(1);
        next();
      },
    );
  });
});
