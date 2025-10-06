import "should";
import dedent from "dedent";
import { parse } from "../lib/index.js";

describe("info count records", function () {
  it("without any options", function (next) {
    const parser = parse(
      dedent`
        a,b,c
        d,e,f
        g,h,i
      `,
      (err) => {
        if (err) return next(err);
        parser.info.records.should.eql(3);
        next();
      },
    );
  });

  it('with "column" option', function (next) {
    const parser = parse(
      dedent`
        1,2,3
        d,e,f
        g,h,i
        j,k,l
        m,n,o
      `,
      {
        columns: true,
      },
      (err) => {
        if (err) return next(err);
        parser.info.records.should.eql(4);
        next();
      },
    );
  });
});
