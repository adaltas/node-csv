import "should";
import { stringify } from "../lib/index.js";

describe("Option `quoted_string`", function () {
  it("quotes string fields", function (next) {
    stringify(
      [[undefined, null, "", " ", "x", 0, false]],
      {
        quoted_string: true,
        eof: false,
      },
      (err, data) => {
        if (err) return next(err);
        data.toString().should.eql(',,""," ","x",0,');
        next();
      },
    );
  });

  it("quotes empty string fields (when all quoted)", function (next) {
    let count = 0;
    let data = "";
    const stringifier = stringify({
      quoted: true,
      quoted_string: true,
      eof: false,
    });
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
      count.should.eql(1);
      data.should.eql(',,""," ","x","0",');
      next();
    });
    stringifier.write([undefined, null, "", " ", "x", 0, false]);
    stringifier.end();
  });
});
