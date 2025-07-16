import "should";
import dedent from "dedent";
import { parse } from "../lib/index.js";

describe("Option `escape`", function () {
  describe("normalisation, coercion & validation", function () {
    it("default", function () {
      parse().options.escape?.should.eql(Buffer.from('"'));
      parse({ escape: undefined }).options.escape?.should.eql(Buffer.from('"'));
      parse({ escape: true }).options.escape?.should.eql(Buffer.from('"'));
    });

    it("custom", function () {
      parse({ escape: "\\" }).options.escape?.should.eql(Buffer.from("\\"));
      parse({ escape: Buffer.from("\\") }).options.escape?.should.eql(
        Buffer.from("\\"),
      );
    });

    it("disabled", function () {
      (parse({ escape: null }).options.escape === null).should.be.true();
      (parse({ escape: false }).options.escape === null).should.be.true();
    });

    it("is compatible with buffer size", function (next) {
      const parser = parse({ escape: "::::::" }, (err, records) => {
        if (err) return next(err);
        records.should.eql([
          ["1", '2"2', "3"],
          ["4", "5", '6"'],
          ["b", "c", "d"],
        ]);
        next();
      });
      for (const c of dedent`
        1,"2::::::"2",3
        4,5,"6::::::""
        b,c,d
      `) {
        parser.write(c);
      }
      parser.end();
    });
  });

  describe("disabled", function () {
    it("when null", function (next) {
      parse(
        "a\"b\n'1\"2'",
        {
          escape: null,
          quote: "'",
        },
        (err, records) => {
          if (err) return next(err);
          records.should.eql([['a"b'], ['1"2']]);
          next();
        },
      );
    });
  });

  describe("same as quote", function () {
    it("length is 1 char", function (next) {
      parse(
        'aa,"b1""b2","c""d""e"\n"f""g",h,"i1""i2"',
        {
          escape: '"',
        },
        (err, records) => {
          if (err) return next(err);
          records.should.eql([
            ["aa", 'b1"b2', 'c"d"e'],
            ['f"g', "h", 'i1"i2'],
          ]);
          next();
        },
      );
    });

    it("length is multiple char", function (next) {
      parse(
        "aa,$$b1$$$$b2$$,$$c$$$$d$$$$e$$\n$$f$$$$g$$,h,$$i1$$$$i2$$",
        {
          escape: "$$",
          quote: "$$",
        },
        (err, records) => {
          if (err) return next(err);
          records.should.eql([
            ["aa", "b1$$b2", "c$$d$$e"],
            ["f$$g", "h", "i1$$i2"],
          ]);
          next();
        },
      );
    });
  });

  describe("different than quote", function () {
    it("apply to quote char", function (next) {
      parse(
        'aa,"b1\\"b2","c\\"d\\"e"\n"f\\"g",h,"i1\\"i2"',
        {
          escape: "\\",
        },
        (err, records) => {
          if (err) return next(err);
          records.should.eql([
            ["aa", 'b1"b2', 'c"d"e'],
            ['f"g', "h", 'i1"i2'],
          ]);
          next();
        },
      );
    });

    it("apply to quote char with custom char", function (next) {
      parse(
        'aa,"b1$$"b2","c$$"d$$"e"\n"f$$"g",h,"i1$$"i2"',
        {
          escape: "$$",
        },
        (err, records) => {
          if (err) return next(err);
          records.should.eql([
            ["aa", 'b1"b2', 'c"d"e'],
            ['f"g', "h", 'i1"i2'],
          ]);
          next();
        },
      );
    });

    it("apply to escape char with escape", function (next) {
      parse(
        'aa,"b1\\\\b2","c\\\\d\\\\e"\n"f\\\\g",h,"i1\\\\i2"',
        {
          escape: "\\",
        },
        (err, records) => {
          if (err) return next(err);
          records.should.eql([
            ["aa", "b1\\b2", "c\\d\\e"],
            ["f\\g", "h", "i1\\i2"],
          ]);
          next();
        },
      );
    });

    it("does not apply outside quoted field", function (next) {
      parse(
        "aa,b1\\\\b2,c\\\\d\\\\e\nf\\\\g,h,i1\\\\i2",
        {
          escape: "\\",
        },
        (err, records) => {
          if (err) return next(err);
          records.should.eql([
            ["aa", "b1\\\\b2", "c\\\\d\\\\e"],
            ["f\\\\g", "h", "i1\\\\i2"],
          ]);
          next();
        },
      );
    });

    it("does not apply to delimiter", function (next) {
      parse(
        "aa\\,bb",
        {
          escape: "\\",
        },
        (err, records) => {
          if (err) return next(err);
          records.should.eql([["aa\\", "bb"]]);
          next();
        },
      );
    });

    it("handle non continuous chunks", function (next) {
      const records: string[] = [];
      const parser = parse({ escape: "\\" });
      parser.on("readable", () => {
        let d;
        while ((d = parser.read())) {
          records.push(d);
        }
      });
      parser.on("end", () => {
        records.should.eql([['abc " def']]);
        next();
      });
      for (const chr of '"abc \\" def"') {
        parser.write(chr);
      }
      parser.end();
    });
  });
});
