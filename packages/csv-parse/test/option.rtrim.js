import "should";
import dedent from "dedent";
import { parse } from "../lib/index.js";
import { assert_error } from "./api.assert_error.js";

describe("Option `rtrim`", function () {
  it("validation", function () {
    parse("", { rtrim: true }, () => {});
    parse("", { rtrim: false }, () => {});
    parse("", { rtrim: null }, () => {});
    parse("", { rtrim: undefined }, () => {});
    (() => {
      parse("", { rtrim: 1 }, () => {});
    }).should.throw("Invalid Option: rtrim must be a boolean, got 1");
    (() => {
      parse("", { rtrim: "true" }, () => {});
    }).should.throw('Invalid Option: rtrim must be a boolean, got "true"');
  });

  it("plain text", function (next) {
    parse(
      dedent`
        a b ,c d
        e f ,g h
      `,
      { quote: "'", escape: "'", trim: true },
      (err, records) => {
        if (!err)
          records.should.eql([
            ["a b", "c d"],
            ["e f", "g h"],
          ]);
        next(err);
      },
    );
  });

  it("after quote", function (next) {
    const data = "'a' ,'b'\n'c' ,'d'";
    const parser = parse(
      { quote: "'", escape: "'", trim: true },
      (err, records) => {
        if (!err)
          records.should.eql([
            ["a", "b"],
            ["c", "d"],
          ]);
        next(err);
      },
    );
    for (const chr of data) {
      parser.write(chr);
    }
    parser.end();
  });

  it("quote followed by escape", function (next) {
    parse(
      dedent`
        'a''' ,'b'''
        'c''','d'''
        'e''','f'''
      `,
      { quote: "'", escape: "'", trim: true },
      (err, records) => {
        if (!err)
          records.should.eql([
            ["a'", "b'"],
            ["c'", "d'"],
            ["e'", "f'"],
          ]);
        next(err);
      },
    );
  });

  it("with whitespaces around quotes", function (next) {
    const data = '"a b "   ,"c d   "\n"e f " ,"g h   "';
    const parser = parse({ rtrim: true }, (err, records) => {
      if (!err)
        records.should.eql([
          ["a b ", "c d   "],
          ["e f ", "g h   "],
        ]);
      next(err);
    });
    for (const chr of data) {
      parser.write(chr);
    }
    parser.end();
  });

  it("with tags around quotes", function (next) {
    const data = [
      `"a\tb\t"\t\t\t,"c\td\t\t\t"\t`,
      `"e\tf\t"\t,"g\th\t\t\t"\t\t\t`,
    ].join("\n");
    const parser = parse({ rtrim: true }, (err, records) => {
      if (!err)
        records.should.eql([
          ["a\tb\t", "c\td\t\t\t"],
          ["e\tf\t", "g\th\t\t\t"],
        ]);
      next(err);
    });
    for (const chr of data) {
      parser.write(chr);
    }
    parser.end();
  });

  it("with char after whitespaces", function (next) {
    const data = ['"a b " x  ,"c d   " x', '"e f " x,"g h   "  x '].join("\n");
    const parser = parse({ rtrim: true }, (err) => {
      assert_error(err, {
        message:
          "Invalid Closing Quote: found non trimable byte after quote at line 1",
        code: "CSV_NON_TRIMABLE_CHAR_AFTER_CLOSING_QUOTE",
        column: 0,
        empty_lines: 0,
        header: false,
        index: 0,
        invalid_field_length: 0,
        quoting: true,
        lines: 1,
        records: 0,
      });
      next();
    });
    for (const chr of data) {
      parser.write(chr);
    }
    parser.end();
  });
});
