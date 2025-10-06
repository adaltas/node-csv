import "should";
import { parse } from "../lib/index.js";

describe("API info", function () {
  it("is exported in the callback on error", function (next) {
    parse("1,2,3\na,b,", (err, records, info) => {
      if (!info) return next(Error("Invalid assessment"));
      info.should.eql({
        bytes: 10,
        bytes_records: 16,
        columns: false,
        comment_lines: 0,
        empty_lines: 0,
        invalid_field_length: 0,
        lines: 2,
        records: 2,
      });
      next();
    });
  });

  it("is exported in the callback on success", function (next) {
    parse("1,2,3\na,b,c", (err, records, info) => {
      if (err) return next(err);
      if (!info) return next(Error("Invalid assessment"));
      info.should.eql({
        bytes: 11,
        bytes_records: 17,
        columns: false,
        comment_lines: 0,
        empty_lines: 0,
        invalid_field_length: 0,
        lines: 2,
        records: 2,
      });
      next();
    });
  });

  it("discovered columns are included", function (next) {
    parse("a,b,c\n1,2,3", { columns: true }, (err, records, info) => {
      if (err) return next(err);
      if (!info) return next(Error("Invalid assessment"));
      info.should.eql({
        bytes: 11,
        bytes_records: 11,
        comment_lines: 0,
        columns: [{ name: "a" }, { name: "b" }, { name: "c" }],
        empty_lines: 0,
        invalid_field_length: 0,
        lines: 2,
        records: 1,
      });
      next();
    });
  });

  it("with multiline records", function (next) {
    parse('a,b,c\nd,"e\n",f\ng,h,i', (err, records, info) => {
      if (err) return next(err);
      if (!info) return next(Error("Invalid assessment"));
      info.should.eql({
        bytes: 20,
        bytes_records: 41,
        columns: false,
        comment_lines: 0,
        empty_lines: 0,
        invalid_field_length: 0,
        lines: 4,
        records: 3,
      });
      next();
    });
  });
});
