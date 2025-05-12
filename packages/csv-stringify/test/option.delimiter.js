import "should";
import { stringify } from "../lib/index.js";

describe("Option `delimiter`", function () {
  it("validation", function () {
    stringify([], { delimiter: "" });
    stringify([], { delimiter: "," });
    stringify([], { delimiter: ",," });
    stringify([], { delimiter: Buffer.from(",") });
    (() => {
      stringify([], { delimiter: true });
    }).should.throw({
      code: "CSV_OPTION_DELIMITER_INVALID_TYPE",
      message: "option `delimiter` must be a buffer or a string, got true",
    });
    (() => {
      stringify([], { delimiter: false });
    }).should.throw({
      code: "CSV_OPTION_DELIMITER_INVALID_TYPE",
      message: "option `delimiter` must be a buffer or a string, got false",
    });
    (() => {
      stringify([], { delimiter: 123 });
    }).should.throw({
      code: "CSV_OPTION_DELIMITER_INVALID_TYPE",
      message: "option `delimiter` must be a buffer or a string, got 123",
    });
  });

  it("with default value", function (next) {
    stringify(
      [
        ["20322051544", "", "8.8017226E7", "45", ""],
        ["", "1974", "8.8392926E7", "", ""],
      ],
      {
        eof: false,
      },
      (err, data) => {
        if (err) return next(err);
        data.should.eql("20322051544,,8.8017226E7,45,\n,1974,8.8392926E7,,");
        next();
      },
    );
  });

  it("disabled if empty", function (next) {
    stringify(
      [
        ["a", 1],
        ["b", 2],
      ],
      {
        delimiter: "",
        eof: false,
      },
      (err, data) => {
        if (err) return next(err);
        data.should.eql("a1\nb2");
        next();
      },
    );
  });

  it("with on character", function (next) {
    stringify(
      [
        ["20322051544", "", "8.8017226E7", "45", ""],
        ["", "1974", "8.8392926E7", "", ""],
      ],
      {
        delimiter: "\t",
        eof: false,
      },
      (err, data) => {
        if (err) return next(err);
        data.should.eql(
          "20322051544\t\t8.8017226E7\t45\t\n\t1974\t8.8392926E7\t\t",
        );
        next();
      },
    );
  });

  it("with multiple character", function (next) {
    stringify(
      [
        ["a", "b"],
        ["c", "d"],
      ],
      {
        delimiter: ":)(:",
        eof: false,
      },
      (err, data) => {
        if (err) return next(err);
        data.should.eql("a:)(:b\nc:)(:d");
        next();
      },
    );
  });
});
