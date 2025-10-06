import "should";
import dedent from "dedent";
import { stringify } from "../lib/index.js";

describe("Option `quote`", function () {
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
        data.should.eql(dedent`
          123
          456,789__,1974
        `);
        next();
      },
    );
  });
});
