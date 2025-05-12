import "should";
import { parse } from "../lib/index.js";

describe("info empty_lines", function () {
  it("no lines", function (next) {
    parse("", (err, records, { empty_lines }) => {
      empty_lines.should.eql(0);
      next();
    });
  });

  it("no empty lines", function (next) {
    parse("a,b,c\nd,e,f", (err, records, { empty_lines }) => {
      empty_lines.should.eql(0);
      next();
    });
  });

  it("one line in the middle of dataset", function (next) {
    parse(
      "a,b,c\n\nd,e,f",
      {
        skip_empty_lines: true,
      },
      (err, records, { empty_lines }) => {
        empty_lines.should.eql(1);
        next();
      },
    );
  });

  it("one line at the end of dataset", function (next) {
    parse("a,b,c\nd,e,f\n", (err, records, { empty_lines }) => {
      empty_lines.should.eql(1);
      next();
    });
  });

  it("dont count empty lines when empty and skip_empty_lines disabled", function (next) {
    parse("\na,b,c\nd,e,f", (err, records, { empty_lines }) => {
      err.message.should.eql(
        "Invalid Record Length: expect 1, got 3 on line 2",
      );
      empty_lines.should.eql(0);
      next();
    });
  });

  it("dont count commented lines", function (next) {
    parse("a,b,c\nd,e,f\n# comment", (err, records, { empty_lines }) => {
      empty_lines.should.eql(0);
      next();
    });
  });
});
