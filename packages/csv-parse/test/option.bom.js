import "should";
import { parse } from "../lib/index.js";

describe("Option `bom`", function () {
  it("validate", function () {
    (() => {
      parse({ bom: "ohno" }, () => {});
    }).should.throw({
      message: 'Invalid option bom: bom must be true, got "ohno"',
      code: "CSV_INVALID_OPTION_BOM",
    });
  });

  it("renormalize trim characters when bom detection switches encoding", function (next) {
    parse(
      Buffer.from("\ufeff a , b ", "utf16le"),
      { bom: true, trim: true },
      (err, records) => {
        records.should.eql([["a", "b"]]);
        next();
      },
    );
  });

  it("renormalize ltrim characters when bom detection switches encoding", function (next) {
    parse(
      Buffer.from("\ufeff a , b ", "utf16le"),
      { bom: true, ltrim: true },
      (err, records) => {
        records.should.eql([["a ", "b "]]);
        next();
      },
    );
  });
});
