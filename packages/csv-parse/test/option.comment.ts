import "should";
import dedent from "dedent";
import { parse } from "../lib/index.js";

describe("Option `comment`", function () {
  it("validation", function () {
    parse("", { comment: undefined }, () => {});
    parse("", { comment: null }, () => {});
    parse("", { comment: false }, () => {});
    parse("", { comment: "" }, () => {});
    (() => {
      parse("", { comment: true }, () => {});
    }).should.throw({
      message:
        "Invalid option comment: comment must be a buffer or a string, got true",
      code: "CSV_INVALID_OPTION_COMMENT",
    });
  });

  it("single comment line", function (next) {
    parse("# comment", { comment: "#" }, (err, records) => {
      records.length.should.eql(0);
      next(err);
    });
  });

  it("single comment line with empty field", function (next) {
    parse('""# comment', { comment: "#" }, (err, records) => {
      records.should.eql([[""]]);
      next(err);
    });
  });

  it("skip line starting by single comment char", function (next) {
    parse(
      dedent`
        # skip this
        "ABC","45"
        "DEF","23"
        # and this
        "GHI","94"
        # as well as that
      `,
      {
        comment: "#",
      },
      (err, records) => {
        if (!err) {
          records.should.eql([
            ["ABC", "45"],
            ["DEF", "23"],
            ["GHI", "94"],
          ]);
        }
        next(err);
      },
    );
  });

  it("doent apply inside quotes", function (next) {
    parse(
      dedent`
        "ABC","45"
        "D#noEF","23"#yes
        "GHI","94"
      `,
      {
        comment: "#",
      },
      (err, records) => {
        if (!err) {
          records.should.eql([
            ["ABC", "45"],
            ["D#noEF", "23"],
            ["GHI", "94"],
          ]);
        }
        next(err);
      },
    );
  });

  it("is cancel if empty", function (next) {
    parse(
      dedent`
      abc,#,def
      1,2,3
    `,
      {
        comment: "",
      },
      (err, records) => {
        records.should.eql([
          ["abc", "#", "def"],
          ["1", "2", "3"],
        ]);
        next();
      },
    );
  });

  it("is cancel by default", function (next) {
    parse("abc,#,def\n1,2,3", (err, records) => {
      records.should.eql([
        ["abc", "#", "def"],
        ["1", "2", "3"],
      ]);
      next();
    });
  });

  it("accept multiple characters", function (next) {
    const parser = parse({ comment: "//" }, (err, records) => {
      records.should.eql([
        ["abc", "def"],
        ["1", "2"],
      ]);
      next();
    });
    const data = dedent`
      abc,def
      // a comment
      1,2
    `;
    for (const char of data) {
      parser.write(char);
    }
    parser.end();
  });

  it("accept quotes", function (next) {
    parse(
      dedent`
        "Alaska","Site1","Rack1","RTU-1","192.168.1.3"
        # Contains double-quote: "
      `,
      {
        comment: "#",
      },
      (err) => next(err),
    );
  });
});
