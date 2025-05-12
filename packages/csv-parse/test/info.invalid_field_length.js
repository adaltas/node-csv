import "should";
import { parse } from "../lib/index.js";

describe("info invalid_field_length", function () {
  it("with relax_column_count", function (next) {
    parse(
      "a,b,c\nd,e\nf,g,h\ni,j",
      {
        relax_column_count: true,
      },
      (err, records, { invalid_field_length }) => {
        records.length.should.eql(4);
        invalid_field_length.should.eql(2);
        next();
      },
    );
  });

  it("with relax_column_count and skip_empty_lines", function (next) {
    parse(
      "a,b,c\n\nd,e,f\n\nh,i",
      {
        relax_column_count: true,
        skip_empty_lines: true,
      },
      (err, data, { empty_lines, invalid_field_length, records }) => {
        empty_lines.should.eql(2);
        invalid_field_length.should.eql(1);
        records.should.eql(3);
        next();
      },
    );
  });
});
