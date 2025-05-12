import "should";
import dedent from "dedent";
import { parse } from "../lib/index.js";
import { assert_error } from "./api.assert_error.js";

describe("Option `quote`", function () {
  it("is compatible with buffer size", function (next) {
    const parser = parse({ escape: "$", quote: "::::::" }, (err, data) => {
      data.should.eql([
        ["1", "2::::::2", "3"],
        ["b", "c", "d"],
      ]);
      next(err);
    });
    for (const c of "1,::::::2$::::::2::::::,3\nb,c,d") {
      parser.write(c);
    }
    parser.end();
  });

  it("default", function () {
    const parser = parse();
    parser.options.quote.should.eql(Buffer.from('"'));
  });

  it("normalize", function () {
    let parser = parse({ quote: true });
    parser.options.quote.should.eql(Buffer.from('"'));
    parser = parse({ quote: false });
    (parser.options.quote === null).should.be.true();
    parser = parse({ quote: null });
    (parser.options.quote === null).should.be.true();
  });

  it("with default", function (next) {
    const data = 'abc,"123",def,"456"\nhij,klm,"789",nop';
    const parser = parse((err, records) => {
      if (err) return next(err);
      records.should.eql([
        ["abc", "123", "def", "456"],
        ["hij", "klm", "789", "nop"],
      ]);
      next();
    });
    for (const chr of data) {
      parser.write(chr);
    }
    parser.end();
  });

  it("with fields containing delimiters", function (next) {
    parse(
      dedent`
        20322051544,",1979.0,8.8017226E7,ABC,45,2000-01-01",1,2,3,4
        28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
        "28392898392,1974.0","8.8392926E7","DEF,23,2050-11-27,",4,5,6
      `,
      (err, records) => {
        if (err) return next(err);
        records.should.eql([
          [
            "20322051544",
            ",1979.0,8.8017226E7,ABC,45,2000-01-01",
            "1",
            "2",
            "3",
            "4",
          ],
          ["28392898392", "1974.0", "8.8392926E7", "DEF", "23", "2050-11-27"],
          [
            "28392898392,1974.0",
            "8.8392926E7",
            "DEF,23,2050-11-27,",
            "4",
            "5",
            "6",
          ],
        ]);
        next();
      },
    );
  });

  it("empty value", function (next) {
    parse(
      dedent`
        20322051544,"",8.8017226E7,45,""
        "",1974,8.8392926E7,"",""
      `,
      (err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["20322051544", "", "8.8017226E7", "45", ""],
          ["", "1974", "8.8392926E7", "", ""],
        ]);
        next();
      },
    );
  });

  it("values containing quotes and double quotes escape", function (next) {
    parse('AB,"""",CD,"""hi"""\n"",JK,"",""\n', (err, records) => {
      if (err) return next(err);
      records.should.eql([
        ["AB", '"', "CD", '"hi"'],
        ["", "JK", "", ""],
      ]);
      next();
    });
  });

  it("only containing quotes and double quotes escape", function (next) {
    const data = '""""\n""""\n';
    const parser = parse((err, records) => {
      if (err) return next(err);
      records.should.eql([['"'], ['"']]);
      next();
    });
    for (const chr of data) {
      parser.write(chr);
    }
    parser.end();
  });

  it("line breaks inside quotes", function (next) {
    parse(
      dedent`
        20322051544,"
        ",8.8017226E7,45,"
        ok
        "
        "
        ",1974,8.8392926E7,"","
        "
      `,
      (err, records) => {
        if (!err) {
          records.should.eql([
            ["20322051544", "\n", "8.8017226E7", "45", "\nok\n"],
            ["\n", "1974", "8.8392926E7", "", "\n"],
          ]);
        }
        next(err);
      },
    );
  });

  describe("disabled", function () {
    it("if empty", function (next) {
      parse(
        dedent`
          a,b,c
          1,r"2"d"2",3
        `,
        { quote: "" },
        (err, records) => {
          if (!err) {
            records.should.eql([
              ["a", "b", "c"],
              ["1", 'r"2"d"2"', "3"],
            ]);
          }
          next(err);
        },
      );
    });

    it("if null", function (next) {
      parse(
        dedent`
          a,b,c
          1,r"2"d"2",3
        `,
        { quote: null },
        (err, records) => {
          if (!err) {
            records.should.eql([
              ["a", "b", "c"],
              ["1", 'r"2"d"2"', "3"],
            ]);
          }
          next(err);
        },
      );
    });

    it("if false", function (next) {
      parse(
        dedent`
          a,b,c
          1,r"2"d"2",3
        `,
        { quote: null },
        (err, records) => {
          if (!err) {
            records.should.eql([
              ["a", "b", "c"],
              ["1", 'r"2"d"2"', "3"],
            ]);
          }
          next(err);
        },
      );
    });
  });

  describe("options", function () {
    it("with multiple chars", function (next) {
      parse(
        dedent`
          $$a$$,b,$$c$$
          1,$$2$$,3
        `,
        { quote: "$$" },
        (err, records) => {
          if (!err) {
            records.should.eql([
              ["a", "b", "c"],
              ["1", "2", "3"],
            ]);
          }
          next(err);
        },
      );
    });

    it("with columns", function (next) {
      parse(
        dedent`
          a,"b",c
          1,"2",3
        `,
        { quote: true, columns: true },
        (err, records) => {
          if (!err) {
            records.should.eql([{ a: "1", b: "2", c: "3" }]);
          }
          next(err);
        },
      );
    });
  });

  describe('error "Quoted field not terminated"', function () {
    it("when unclosed", function (next) {
      parse(`"",1974,8.8392926E7,"","`, (err) => {
        assert_error(err, {
          message:
            "Quote Not Closed: the parsing is finished with an opening quote at line 1",
          code: "CSV_QUOTE_NOT_CLOSED",
        });
        next();
      });
    });
  });

  describe('error "Invalid Closing Quote"', function () {
    it("when followed by a character", function (next) {
      parse('""!', { quote: '"', escape: '"' }, (err) => {
        assert_error(err, {
          message:
            'Invalid Closing Quote: got "!" at line 1 instead of delimiter, record delimiter, trimable character (if activated) or comment',
          code: "CSV_INVALID_CLOSING_QUOTE",
        });
        next();
      });
    });

    it("no throw followed by a comment", function (next) {
      parse(
        '""# A comment',
        { quote: '"', escape: '"', comment: "#" },
        (err) => {
          next(err);
        },
      );
    });

    it("no throw followed by a delimiter", function (next) {
      parse('""|BB', { quote: '"', escape: '"', delimiter: "|" }, (err) => {
        next(err);
      });
    });

    it("no throw followed by a record delimiter", function (next) {
      parse(
        '""|BB',
        { quote: '"', escape: '"', record_delimiter: "|" },
        (err) => {
          next(err);
        },
      );
    });

    it("no throw followed by a trimable character", function (next) {
      parse('"" ', { quote: '"', escape: '"', rtrim: true }, (err) => {
        next(err);
      });
    });
  });

  describe('error "Invalid opening quotes"', function () {
    it("with indexed columns", function (next) {
      parse(
        dedent`
          "this","line","is",valid
          "this","line",is,"also,valid"
          this,"line",is,invalid h"ere"
          "and",valid,line,follows...
        `,
        (err, records) => {
          assert_error(err, {
            message:
              'Invalid Opening Quote: a quote is found on field 3 at line 3, value is "invalid h"',
            code: "INVALID_OPENING_QUOTE",
            field: "invalid h",
          });
          (records === undefined).should.be.true;
          next();
        },
      );
    });

    it("with named columns", function (next) {
      parse(
        dedent`
          "a","b","c","d"
          "11","12",13,"14"
          21,"22",23,2"4"
        `,
        { columns: true },
        (err, records) => {
          assert_error(err, {
            message:
              'Invalid Opening Quote: a quote is found on field "d" at line 3, value is "2"',
            code: "INVALID_OPENING_QUOTE",
            field: "2",
          });
          (records === undefined).should.be.true;
          next();
        },
      );
    });
  });
});
