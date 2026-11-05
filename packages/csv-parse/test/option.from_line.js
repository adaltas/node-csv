import "should";
import dedent from "dedent";
import { parse } from "../lib/index.js";

describe("Option `from_line`", function () {
  it("validation", function () {
    (() => {
      parse("", { from_line: true }, () => {});
    }).should.throw("Invalid Option: from_line must be an integer, got true");
    (() => {
      parse("", { from_line: false }, () => {});
    }).should.throw("Invalid Option: from_line must be an integer, got false");
  });

  it("start at defined position", function (next) {
    parse(
      dedent`
        1,2,3
        4,5,6
        7,8,9
      `,
      { from_line: 3 },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([["7", "8", "9"]]);
        next();
      },
    );
  });

  it("handle lines with inconsistent number of fields", function (next) {
    parse(
      dedent`
        a
        1,2,3
      `,
      { from_line: 2 },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([["1", "2", "3"]]);
        next();
      },
    );
  });

  it("records with quoted line at the beginning of line", function (next) {
    parse(
      dedent`1,2,"

        3"
        4,5,"
        6"
        7,8,"
        9"
      `,
      { from_line: 4 },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["4", "5", "\n6"],
          ["7", "8", "\n9"],
        ]);
        next();
      },
    );
  });

  it("records with quoted line in the middle of line", function (next) {
    parse(
      dedent`
        1,2,"

        3"
        4,5,"
        6"
        7,8,"
        9"
      `,
      { from_line: 2 },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["4", "5", "\n6"],
          ["7", "8", "\n9"],
        ]);
        next();
      },
    );
  });

  it("not influenced by `record_delimiter` option", function (next) {
    parse(
      dedent`
        a,b,c:1,2,
        3:d,e,f:4,5,
        6:g,h,i:7,8,
        9
      `,
      { from_line: 3, record_delimiter: ":" },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["g", "h", "i"],
          ["7", "8", "\n9"],
        ]);
        next();
      },
    );
  });

  it("no influenced by skip_empty_lines option", function (next) {
    parse(
      dedent`
        a,b,c

        1,2,3

        4,5,6

        7,8,9
      `,
      { from_line: 5, skip_empty_lines: true },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["4", "5", "6"],
          ["7", "8", "9"],
        ]);
        next();
      },
    );
  });

  it("handle multiple bytes record delimiters", function (next) {
    parse(`a,b\r\nc,d\r\ne,f`, { from_line: 2 }, (err, records) => {
      if (err) return next(err);
      records.should.eql([
        ["c", "d"],
        ["e", "f"],
      ]);
      next();
    });
  });

  it("honors header", function (next) {
    parse(
      dedent`
        x,y,z
        x,y,z
        a,b,c
        4,5,6
      `,
      { from_line: 3, columns: true },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([{ a: "4", b: "5", c: "6" }]);
        next();
      },
    );
  });
});

describe("Option `from_line` as an object", function () {
  it("does not count leading comment lines", function (next) {
    parse(
      dedent`
        // Some
        // Number of
        // Comments
        thing1=value1
        thing2=value2
        header1,header2,header3
        value,value,value
      `,
      { comment: "//", from_line: { position: 3, skip_comments: true } },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["header1", "header2", "header3"],
          ["value", "value", "value"],
        ]);
        next();
      },
    );
  });

  it("does not count comment lines between records", function (next) {
    parse(
      dedent`
        a,b,c
        # a comment
        1,2,3
        # another comment
        4,5,6
      `,
      { comment: "#", from_line: { position: 2, skip_comments: true } },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["1", "2", "3"],
          ["4", "5", "6"],
        ]);
        next();
      },
    );
  });

  it("counts a record preceded by comments from its non-comment position", function (next) {
    parse(
      "# comment\nx,y\n# comment\n1,2\n3,4",
      { comment: "#", from_line: { position: 3, skip_comments: true } },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([["3", "4"]]);
        next();
      },
    );
  });

  it("does not count a comment in the middle of a line", function (next) {
    parse(
      "a,b # comment\n1,2\n3,4",
      { comment: "#", from_line: 2 },
      (err, records) => {
        if (err) return next(err);
        // the trailing comment does not make the first line a comment
        // line, so `from_line: 2` starts at the second line
        records.should.eql([
          ["1", "2"],
          ["3", "4"],
        ]);
        next();
      },
    );
  });

  it("honors header after comment lines", function (next) {
    parse(
      dedent`
        # comment
        # comment
        skip,skip
        a,b
        1,2
      `,
      {
        comment: "#",
        from_line: { position: 2, skip_comments: true },
        columns: true,
      },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([{ a: "1", b: "2" }]);
        next();
      },
    );
  });

  it("validation", function () {
    (() => {
      parse("", { from_line: { position: 2, skip_comments: "yes" } }, () => {});
    }).should.throw(
      'Invalid Option: from_line skip_comments must be a boolean, got "yes"',
    );
    (() => {
      parse("", { from_line: { position: 0 } }, () => {});
    }).should.throw(
      'Invalid Option: from_line must be a positive integer greater than 0, got {"position":0}',
    );
    (() => {
      parse("", { from_line: {} }, () => {});
    }).should.throw("Invalid Option: from_line must be an integer, got {}");
  });

  it("counts comment lines when skip_comments is not set", function (next) {
    parse(
      "# a\n# b\nx,y\n1,2\n3,4",
      { comment: "#", from_line: { position: 3 } },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["1", "2"],
          ["3", "4"],
        ]);
        next();
      },
    );
  });

  it("comment lines are counted by default", function (next) {
    parse(
      "# a\n# b\nx,y\n1,2\n3,4",
      { comment: "#", from_line: 3 },
      (err, records) => {
        if (err) return next(err);
        // without the option, the result is unchanged: comment lines
        // are counted by `from_line` (with the option enabled, the
        // same input only returns the last record)
        records.should.eql([
          ["1", "2"],
          ["3", "4"],
        ]);
        next();
      },
    );
  });
});
