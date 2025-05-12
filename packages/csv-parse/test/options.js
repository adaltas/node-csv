import "should";
import dedent from "dedent";
import { parse } from "../lib/index.js";

describe("Options", function () {
  it("are cloned", function (next) {
    const options = { quote: false };
    parse(
      dedent`
        FIELD_1,FIELD_2
        20322051544,1979
        28392898392,1974
      `,
      options,
      (err) => {
        if (err) return next(err);
        (options.quote === false).should.be.true();
        next();
      },
    );
  });

  it("underscore options", function () {
    const parser = parse({ recordDelimiter: ":" });
    parser.options.record_delimiter.toString().should.eql(":");
    (parser.options.recordDelimiter === undefined).should.be.true();
  });
});
