import "should";
import dedent from "dedent";
import { parse } from "../lib/index.js";
import { parse as parseSync } from "../lib/sync.js";
import { assert_error } from "./api.assert_error.js";

describe("Option `rtrim`", function () {
  for (const encoding of ["utf8", "utf16le"] as const) {
    for (const trimming of [{ rtrim: true }, { trim: true }]) {
      describe(`${encoding} with ${Object.keys(trimming)[0]}`, function () {
        const whitespaces = [" ", "\t", "\u00a0", "\u2003", "\u3000"];

        it("trims after quoted fields before delimiters and end of input", function () {
          for (const whitespace of whitespaces) {
            const data = Buffer.from(
              `" a "${whitespace},""${whitespace}|"b"${whitespace},"c"${whitespace}`,
              encoding,
            );
            parseSync(data, {
              ...trimming,
              encoding,
              record_delimiter: "|",
            }).should.eql([
              [" a ", ""],
              ["b", "c"],
            ]);
          }
        });

        it("trims after quoted fields with one-byte stream writes", async function () {
          for (const whitespace of whitespaces) {
            const data = Buffer.from(
              `" a "${whitespace},""${whitespace}|"b"${whitespace},"c"${whitespace}`,
              encoding,
            );
            const records = await new Promise<string[][]>((resolve, reject) => {
              const parser = parse(
                { ...trimming, encoding, record_delimiter: "|" },
                (err, records) => (err ? reject(err) : resolve(records)),
              );
              for (const byte of data) {
                parser.write(Buffer.from([byte]));
              }
              parser.end();
            });
            records.should.eql([
              [" a ", ""],
              ["b", "c"],
            ]);
          }
        });

        it("rejects non-whitespace after trailing whitespace", function () {
          for (const whitespace of whitespaces) {
            (() => {
              parseSync(Buffer.from(`"a"${whitespace}x`, encoding), {
                ...trimming,
                encoding,
              });
            }).should.throw({
              code: "CSV_NON_TRIMABLE_CHAR_AFTER_CLOSING_QUOTE",
            });
          }
        });
      });
    }
  }

  it("validation", function () {
    parse("", { rtrim: true }, () => {});
    parse("", { rtrim: false }, () => {});
    parse("", { rtrim: null }, () => {});
    parse("", { rtrim: undefined }, () => {});
  });

  it("plain text", function (next) {
    parse(
      dedent`
        a b ,c d
        e f ,g h
      `,
      { quote: "'", escape: "'", trim: true },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["a b", "c d"],
          ["e f", "g h"],
        ]);
        next();
      },
    );
  });

  it("after quote", function (next) {
    const data = "'a' ,'b'\n'c' ,'d'";
    const parser = parse(
      { quote: "'", escape: "'", trim: true },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["a", "b"],
          ["c", "d"],
        ]);
        next();
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
        if (err) return next(err);
        records.should.eql([
          ["a'", "b'"],
          ["c'", "d'"],
          ["e'", "f'"],
        ]);
        next();
      },
    );
  });

  it("with whitespaces around quotes", function (next) {
    const data = '"a b "   ,"c d   "\n"e f " ,"g h   "';
    const parser = parse({ rtrim: true }, (err, records) => {
      if (err) return next(err);
      records.should.eql([
        ["a b ", "c d   "],
        ["e f ", "g h   "],
      ]);
      next();
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
      if (err) return next(err);
      records.should.eql([
        ["a\tb\t", "c\td\t\t\t"],
        ["e\tf\t", "g\th\t\t\t"],
      ]);
      next();
    });
    for (const chr of data) {
      parser.write(chr);
    }
    parser.end();
  });

  it("with char after whitespaces", function (next) {
    const data = ['"a b " x  ,"c d   " x', '"e f " x,"g h   "  x '].join("\n");
    const parser = parse({ rtrim: true }, (err) => {
      if (!err) return next(Error("Invalid assessment"));
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
