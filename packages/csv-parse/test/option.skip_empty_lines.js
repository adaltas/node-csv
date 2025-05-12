import "should";
import { parse } from "../lib/index.js";

describe("Option `skip_empty_lines`", function () {
  it("validation", function () {
    parse("", { skip_empty_lines: true }, () => {});
    parse("", { skip_empty_lines: false }, () => {});
    parse("", { skip_empty_lines: null }, () => {});
    parse("", { skip_empty_lines: undefined }, () => {});
    (() => {
      parse("", { skip_empty_lines: 1 }, () => {});
    }).should.throw(
      "Invalid Option: skip_empty_lines must be a boolean, got 1",
    );
    (() => {
      parse("", { skip_empty_lines: "oh no" }, () => {});
    }).should.throw(
      'Invalid Option: skip_empty_lines must be a boolean, got "oh no"',
    );
  });

  describe("false", function () {
    it("dont skip by default", function (next) {
      parse("ABC\n\nDEF", (err, records) => {
        if (!err) {
          records.should.eql([["ABC"], [""], ["DEF"]]);
        }
        next(err);
      });
    });
  });

  describe("usage", function () {
    it("skip", function (next) {
      parse("ABC\n\nDEF", { skip_empty_lines: true }, (err, records) => {
        if (!err) {
          records.should.eql([["ABC"], ["DEF"]]);
        }
        next(err);
      });
    });

    it("quoted fields are not interpreted as empty", function (next) {
      parse('ABC\n""\nDEF', { skip_empty_lines: true }, (err, records) => {
        if (!err) {
          records.should.eql([["ABC"], [""], ["DEF"]]);
        }
        next(err);
      });
    });

    it("skip respect parser.read", function (next) {
      const records = [];
      const parser = parse({ skip_empty_lines: true });
      parser.write(
        "\n20322051544,1979,8.8017226E7,ABC,45,2000-01-01\n\n28392898392,1974,8.8392926E7,DEF,23,2050-11-27\n",
      );
      parser.on("readable", () => {
        let d;
        while ((d = parser.read())) {
          records.push(d);
        }
      });
      parser.on("error", (err) => {
        next(err);
      });
      parser.on("end", () => {
        records.should.eql([
          ["20322051544", "1979", "8.8017226E7", "ABC", "45", "2000-01-01"],
          ["28392898392", "1974", "8.8392926E7", "DEF", "23", "2050-11-27"],
        ]);
        next();
      });
      parser.end();
    });
  });

  describe("with other options", function () {
    it("used conjointly with trim to ignore whitespaces", function (next) {
      parse(
        "a,b,c\n\t\nd,e,f",
        {
          skip_empty_lines: true,
          trim: true,
        },
        (err, records) => {
          if (!err) {
            records.should.eql([
              ["a", "b", "c"],
              ["d", "e", "f"],
            ]);
          }
          next(err);
        },
      );
    });
  });
});
