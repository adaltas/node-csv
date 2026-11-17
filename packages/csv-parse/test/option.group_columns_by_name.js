import "should";
import { parse } from "../lib/index.js";
import { parse as parseSync } from "../lib/sync.js";

describe("Option `group_columns_by_name`", function () {
  it("validate", function () {
    (() => {
      parse("", { group_columns_by_name: "invalid" });
    }).should.throw({
      code: "CSV_INVALID_OPTION_GROUP_COLUMNS_BY_NAME",
      message:
        'Invalid option group_columns_by_name: expect a boolean, got "invalid"',
    });
  });

  it("group three or more duplicate columns", function () {
    parseSync("a,b,a,a\n1,2,3,4", {
      columns: true,
      group_columns_by_name: true,
    }).should.eql([{ a: ["1", "3", "4"], b: "2" }]);
  });

  it("flatten array values returned by cast", function () {
    parseSync("a,a,a\nx,y,z", {
      columns: true,
      group_columns_by_name: true,
      cast: (value, { header }) => (header ? value : [value, value]),
    }).should.eql([{ a: ["x", "x", "y", "y", "z", "z"] }]);
  });

  it("scale linearly with many duplicate columns", function () {
    this.timeout(5000);
    const n = 50000;
    const [record] = parseSync(
      Array(n).fill("a").join(",") + "\n" + Array(n).fill("1").join(","),
      { columns: true, group_columns_by_name: true },
    );
    record.a.length.should.eql(n);
  });
});
