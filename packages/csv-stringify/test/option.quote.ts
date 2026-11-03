import "should";
import dedent from "dedent";
import { stringify } from "../lib/index.js";
import { stringify as stringifySync } from "../lib/sync.js";

describe("Option `quote`", function () {
  it("preserves special characters when quoting is disabled", function () {
    for (const quote of [false, ""]) {
      stringifySync([['say "hi", bob'], ['say "hi"\nbob']], {
        quote,
      }).should.eql('say "hi", bob\nsay "hi"\nbob\n');
    }
  });

  it("preserves fields selected for quoting when quoting is disabled", function () {
    for (const quote of [false, ""]) {
      for (const options of [
        { quoted: true },
        { quoted_string: true },
        { quoted_match: /hi/ },
      ]) {
        stringifySync([['say "hi"']], { quote, ...options }).should.eql(
          'say "hi"\n',
        );
      }
    }
  });

  it("preserves quotes supplied by a cast with quoting disabled", function () {
    stringifySync([["abc", 1]], {
      quoted: true,
      cast: {
        number: (value) => ({ value: `="${value}"`, quote: false }),
      },
    }).should.eql('"abc",="1"\n');
  });

  it("preserves custom escape characters when quoting is disabled", function () {
    stringifySync([["C:\\dir,x"]], {
      quote: false,
      escape: "\\",
    }).should.eql("C:\\dir,x\n");
  });

  it("preserves quotes in fields containing a custom delimiter", function () {
    stringifySync([['{"a":1}\tx']], {
      quote: "",
      delimiter: "\t",
    }).should.eql('{"a":1}\tx\n');
  });

  it("preserves selected fields in the callback API with quoting disabled", function (next) {
    stringify([['say "hi"']], { quote: false, quoted: true }, (err, data) => {
      if (err) return next(err);
      data.should.eql('say "hi"\n');
      next();
    });
  });

  it("default", function (next) {
    const stringifier = stringify([], () => {
      stringifier.options.quote.should.eql('"');
      next();
    });
  });

  it("validation", function () {
    stringify([], { quote: "" });
    stringify([], { quote: '"' });
    stringify([], { quote: "||" });
    stringify([], { quote: Buffer.from('"') });
    stringify([], { quote: true });
    stringify([], { quote: false });
  });

  it("disabled if empty", function (next) {
    stringify(
      [
        ["20322051544", '"', "8.8017226E7", 45, '"ok"'],
        ["", "1974", "8.8392926E7", "", ""],
      ],
      {
        eof: false,
        quote: "",
      },
      (err, data) => {
        data.should.eql(
          dedent`
            20322051544,",8.8017226E7,45,"ok"
            ,1974,8.8392926E7,,
          `,
        );
        next();
      },
    );
  });

  it("custom value with quoted", function (next) {
    stringify(
      [
        ["a", "", "b"],
        ["", "c", ""],
      ],
      {
        eof: false,
        quote: "|",
        quoted: true,
      },
      (err, data) => {
        data.should.eql("|a|,,|b|\n,|c|,");
        next();
      },
    );
  });

  it("fields with separator inside fields", function (next) {
    stringify(
      [
        ["20322051544", "1979.0", "8.8017226E7", "ABC,45", "2000-01-01"],
        ["28392898392", "1974.0", "8.8392926E7", "DEF", "23", "2050-11-27"],
      ],
      {
        eof: false,
      },
      (err, data) => {
        data.should.eql(
          dedent`
            20322051544,1979.0,8.8017226E7,"ABC,45",2000-01-01
            28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27
          `,
        );
        next();
      },
    );
  });

  it("fields containing delimiters", function (next) {
    stringify(
      [
        ["20322051544", ",1979.0,8.8017226E7,ABC,45,2000-01-01"],
        ["28392898392", "1974.0", "8.8392926E7", "DEF", "23", "2050-11-27"],
        ["28392898392,1974.0", "8.8392926E7", "DEF,23,2050-11-27,"],
      ],
      {
        eof: false,
      },
      (err, data) => {
        data.should.eql(
          dedent`
            20322051544,",1979.0,8.8017226E7,ABC,45,2000-01-01"
            28392898392,1974.0,8.8392926E7,DEF,23,2050-11-27\n"28392898392,1974.0",8.8392926E7,"DEF,23,2050-11-27,"
          `,
        );
        next();
      },
    );
  });

  it("fields containing quotes", function (next) {
    stringify(
      [
        ["20322051544", "1979.0", '8.801"7226E7', "ABC", "45", "2000-01-01"],
        ["28392898392", "1974.0", "8.8392926E7", "DEF", '2"3', "2050-11-27"],
      ],
      {
        eof: false,
      },
      (err, data) => {
        data.should.eql(
          dedent`
            20322051544,1979.0,"8.801""7226E7",ABC,45,2000-01-01
            28392898392,1974.0,8.8392926E7,DEF,"2""3",2050-11-27
          `,
        );
        next();
      },
    );
  });

  it("empty fields", function (next) {
    stringify(
      [
        ["20322051544", "", "8.8017226E7", "45", ""],
        ["", "1974", "8.8392926E7", "", ""],
      ],
      {
        eof: false,
      },
      (err, data) => {
        data.should.eql(dedent`
          20322051544,,8.8017226E7,45,
          ,1974,8.8392926E7,,
        `);
        next();
      },
    );
  });

  it("fields containing quotes and double quotes escape", function (next) {
    stringify(
      [
        ["20322051544", '"', "8.8017226E7", 45, '"ok"'],
        ["", "1974", "8.8392926E7", "", ""],
      ],
      {
        eof: false,
      },
      (err, data) => {
        data.should.eql(
          dedent`
            20322051544,"""",8.8017226E7,45,"""ok"""
            ,1974,8.8392926E7,,
          `,
        );
        next();
      },
    );
  });

  it("fields with line breaks inside quotes", function (next) {
    stringify(
      [
        ["20322051544", "\n", ",8.8017226E7", 45, "\nok\n"],
        ["\n", "1974", "8.8392926E7", "", "\n"],
      ],
      {
        eof: false,
      },
      (err, data) => {
        data.should.eql(
          dedent`
            20322051544,"\n",",8.8017226E7",45,"\nok\n"
            "\n",1974,8.8392926E7,,"\n"
          `,
        );
        next();
      },
    );
  });

  it("field where quote string is empty", function (next) {
    stringify(
      [
        ["20322051544", '"', "8.8017226E7", 45, '"ok"'],
        ["", "1974", "8.8392926E7", "", ""],
      ],
      {
        eof: false,
        quote: "",
      },
      (err, data) => {
        data.should.eql(
          dedent`
            20322051544,",8.8017226E7,45,"ok"
            ,1974,8.8392926E7,,
          `,
        );
        next();
      },
    );
  });

  it("fields with linebreaks and different record delimiter", function (next) {
    stringify(
      [
        ["123\n456", 789],
        ["", "1974"],
      ],
      {
        eof: false,
        record_delimiter: "__",
      },
      (err, data) => {
        if (err) return next(err);
        data.should.eql(dedent`
          123
          456,789__,1974
        `);
        next();
      },
    );
  });

  it("regex metacharacter quote is doubled literally (fix #494)", function () {
    // See "Option `escape` - regexp metacharacter escape is doubled literally (fix #494)"
    // Same class of bug on `new RegExp(quote, "g")` when the quote character is
    // a regexp metacharacter and appears inside the field.
    // Before #494, the returned value was `."."."..`
    stringifySync([["a.b"]], { quote: ".", eof: false }).should.eql('.a".b.');
    // Before #494, the returned value was `|\|a\||\|b\||`
    stringifySync([["a|b"]], {
      quote: "|",
      escape: "\\",
      eof: false,
    }).should.eql("|a\\|b|");
  });
});
