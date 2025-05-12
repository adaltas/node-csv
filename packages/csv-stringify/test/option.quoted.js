import "should";
import dedent from "dedent";
import { stringify } from "../lib/index.js";

describe("Option `quoted`", function () {
  it("surround fields", function (next) {
    let count = 0;
    let data = "";
    const stringifier = stringify({ quoted: true, eof: false });
    stringifier.on("readable", () => {
      let d;
      while ((d = stringifier.read())) {
        data += d;
      }
    });
    stringifier.on("record", () => {
      count++;
    });
    stringifier.on("finish", () => {
      count.should.eql(2);
      data.should.eql(
        dedent`
          "20322051544","1979.0","8.801""7226E7","ABC"
          "283928""98392","1974.0","8.8392926E7","DEF"
        `,
      );
      next();
    });
    stringifier.write(["20322051544", "1979.0", '8.801"7226E7', "ABC"]);
    stringifier.write(['283928"98392', "1974.0", "8.8392926E7", "DEF"]);
    stringifier.end();
  });

  it("is executed after cast and apply to numbers", function (next) {
    stringify(
      [[10.1]],
      {
        delimiter: ";",
        cast: {
          number: (value) => {
            return value.toString().replace(".", ",");
          },
        },
        quoted_match: ",",
      },
      (err, data) => {
        if (!err) data.should.eql('"10,1"\n');
        next(err);
      },
    );
  });

  it("local option in cast overwriting global", function (next) {
    stringify(
      [["10.1", "10.2"]],
      {
        delimiter: ";",
        cast: {
          string: (value, { index }) => ({
            value: value.replace(".", ","),
            quoted_match: index === 0 ? "," : null,
          }),
        },
        quoted_match: ",",
      },
      (err, data) => {
        if (!err) data.should.eql('"10,1";10,2\n');
        next(err);
      },
    );
  });
});
