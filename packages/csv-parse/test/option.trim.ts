import "should";
import dedent from "dedent";
import { parse } from "../lib/index.js";

describe("Option `trim`", function () {
  it("validation", function () {
    parse("", { trim: true }, () => {});
    parse("", { trim: false }, () => {});
    parse("", { trim: null }, () => {});
    parse("", { trim: undefined }, () => {});
  });

  it("set ltrim", function () {
    const parser = parse({ trim: true });
    parser.options.ltrim.should.be.true();
  });

  it("respect ltrim", function () {
    const parser = parse({ trim: true, ltrim: false });
    parser.options.ltrim.should.be.false();
  });

  it("set rtrim", function () {
    const parser = parse({ trim: true });
    parser.options.rtrim.should.be.true();
  });

  it("respect rtrim", function () {
    const parser = parse({ trim: true, rtrim: false });
    parser.options.rtrim.should.be.false();
  });

  it("interpret whitespaces", function (next) {
    parse(
      [
        String.fromCharCode(9), // Horizontal tab
        String.fromCharCode(10), // NL line feed
        String.fromCharCode(12), // NP Form feed
        String.fromCharCode(13), // Carriage return
        String.fromCharCode(32), // Space
        "sth",
      ].join(""),
      { trim: true, record_delimiter: "|" },
      (err, records) => {
        records.should.eql([["sth"]]);
        next();
      },
    );
  });

  it("should ignore the whitespaces immediately preceding and following the delimiter", function (next) {
    const records: string[] = [];
    const parser = parse({ trim: true });
    parser.on("readable", () => {
      let d;
      while ((d = parser.read())) {
        records.push(d);
      }
    });
    parser.on("end", () => {
      records.should.eql([
        ["FIELD 1", "FIELD 2", "FIELD 3", "FIELD 4", "FIELD 5", "FIELD 6"],
        ["20322051544", "1979", "8.8017226E7", "ABC", "45", "2000-01-01"],
        ["28392898392", "1974", "8.8392926E7", "DEF", "23", "2050-11-27"],
      ]);
      next();
    });
    parser.write(
      [
        "  FIELD 1  ,  FIELD 2 , FIELD 3,FIELD 4 , FIELD 5,FIELD 6   ",
        "20322051544,1979  ,8.8017226E7,ABC  , 45 ,    2000-01-01",
        "  28392898392,    1974,8.8392926E7,DEF   ,  23 , 2050-11-27",
      ].join("\n"),
    );
    parser.end();
  });

  it("should preserve whitespace inside text if there are quotes or not", function (next) {
    const records: string[] = [];
    const parser = parse({ trim: true });
    parser.on("readable", () => {
      let d;
      while ((d = parser.read())) {
        records.push(d);
      }
    });
    parser.on("end", () => {
      records.should.eql([
        ["FIELD 1", "FIELD 2", "FIELD 3", "FIELD 4", "FIELD 5", "FIELD 6"],
        ["20322051544", "1979", "8.8017226E7", "ABC DEF", "45", "2000-01-01"],
        ["28392898392", "1974", "8.8392926E7", " ABC DEF ", "23", "2050-11-27"],
      ]);
      next();
    });
    parser.write(dedent`
      FIELD 1,  FIELD 2, FIELD 3, FIELD 4, FIELD 5, FIELD 6
      20322051544, 1979, 8.8017226E7, ABC DEF , 45, 2000-01-01
      28392898392, 1974, 8.8392926E7," ABC DEF ", 23, 2050-11-27
    `);
    parser.end();
  });

  it("with columns and last field is a space", function (next) {
    parse(
      dedent`
        h1,h2,h3,
        1,2,3,
        4,5,6,
      `,
      {
        delimiter: ",",
        columns: true,
        trim: true,
      },
      (err, records) => {
        if (!err) {
          records.should.eql([
            { h1: "1", h2: "2", h3: "3", "": "" },
            { h1: "4", h2: "5", h3: "6", "": "" },
          ]);
        }
        next(err);
      },
    );
  });

  it("last field empty", function (next) {
    parse("a,", { trim: true }, (err, records) => {
      if (!err) {
        records.should.eql([["a", ""]]);
      }
      next(err);
    });
  });

  it("with skip_empty_lines and empty lines at the end", function (next) {
    parse(
      dedent`
        letter,number
        a,1

        b,2
        c,3
      ` + "\n\n",
      {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([
          { letter: "a", number: "1" },
          { letter: "b", number: "2" },
          { letter: "c", number: "3" },
        ]);
        next();
      },
    );
  });

  it("write aggressively", function (next) {
    const records: string[] = [];
    const parser = parse({ trim: true });
    parser.on("readable", () => {
      let d;
      while ((d = parser.read())) {
        records.push(d);
      }
    });
    parser.on("end", () => {
      records.should.eql([
        ["Test 0", "", " 0,00 ", '"'],
        ["Test 1", "", " 100000,100000 ", '"'],
        ["Test 2", "", " 200000,200000 ", '"'],
        ["Test 3", "", " 300000,300000 ", '"'],
        ["Test 4", "", " 400000,400000 ", '"'],
        ["Test 5", "", " 500000,500000 ", '"'],
        ["Test 6", "", " 600000,600000 ", '"'],
        ["Test 7", "", " 700000,700000 ", '"'],
        ["Test 8", "", " 800000,800000 ", '"'],
        ["Test 9", "", " 900000,900000 ", '"'],
      ]);
      next();
    });
    const data = [
      ' Test 0 ,," 0,00 ","""" ',
      ' Test 1 ,," 100000,100000 ","""" ',
      ' Test 2 ,," 200000,200000 ","""" ',
      ' Test 3 ,," 300000,300000 ","""" ',
      ' Test 4 ,," 400000,400000 ","""" ',
      ' Test 5 ,," 500000,500000 ","""" ',
      ' Test 6 ,," 600000,600000 ","""" ',
      ' Test 7 ,," 700000,700000 ","""" ',
      ' Test 8 ,," 800000,800000 ","""" ',
      ' Test 9 ,," 900000,900000 ","""" ',
    ].join("\n");
    for (const chr of data) {
      parser.write(chr);
    }
    parser.end();
  });

  describe("no trim", function () {
    it("should preserve surrounding whitespaces", function (next) {
      const records: string[] = [];
      const parser = parse();
      parser.on("readable", () => {
        let d;
        while ((d = parser.read())) {
          records.push(d);
        }
      });
      parser.on("end", () => {
        records.should.eql([
          [
            "  FIELD 1  ",
            "  FIELD 2 ",
            " FIELD 3",
            "FIELD 4 ",
            " FIELD 5",
            "FIELD 6   ",
          ],
          [
            "20322051544",
            "1979  ",
            "8.8017226E7",
            "AB C  ",
            " 45 ",
            "   2000-01-01",
          ],
          [
            "  28392898392",
            "    1974",
            "8.8392926E7",
            "D EF   ",
            "  23 ",
            " 2050-11-27",
          ],
        ]);
        next();
      });
      parser.write(
        [
          "  FIELD 1  ,  FIELD 2 , FIELD 3,FIELD 4 , FIELD 5,FIELD 6   ",
          "20322051544,1979  ,8.8017226E7,AB C  , 45 ,   2000-01-01",
          "  28392898392,    1974,8.8392926E7,D EF   ,  23 , 2050-11-27",
        ].join("\n"),
      );
      parser.end();
    });
  });

  describe("options", function () {
    it("with encoding", function (next) {
      parse(
        Buffer.from(" ф , ф ", "utf16le"),
        {
          encoding: "utf16le",
          trim: true,
        },
        (err, records) => {
          if (!err) {
            records.should.eql([["ф", "ф"]]);
          }
          next(err);
        },
      );
    });

    it("ltrim with encoding", function (next) {
      parse(
        Buffer.from(" ф , ф ", "utf16le"),
        {
          encoding: "utf16le",
          ltrim: true,
        },
        (err, records) => {
          if (!err) {
            records.should.eql([["ф ", "ф "]]);
          }
          next(err);
        },
      );
    });

    it("rtrim with encoding", function (next) {
      parse(
        Buffer.from(" ф , ф ", "utf16le"),
        {
          encoding: "utf16le",
          rtrim: true,
        },
        (err, records) => {
          if (!err) {
            records.should.eql([[" ф", " ф"]]);
          }
          next(err);
        },
      );
    });
  });
});
