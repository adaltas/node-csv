import "should";
import { stringify } from "../lib/index.js";
import { stringify as stringifySync } from "../lib/sync.js";

describe("Option `quoted_string`", function () {
  it("quotes a string cast to an empty string", function (next) {
    stringify(
      [[" ", "", null, undefined, "text"]],
      { quoted_string: true, cast: { string: (value) => value.trim() } },
      (err, data) => {
        if (err) return next(err);
        data.should.eql('"","",,,"text"\n');
        next();
      },
    );
  });

  it("only quotes string fields when casts return empty strings", function () {
    const data = stringifySync([[" ", "", 0, false, null, undefined]], {
      quoted_string: true,
      cast: {
        string: (value) => value.trim(),
        number: () => "",
      },
    });
    data.should.eql('"","",,,,\n');
  });

  it("respects quoted_empty when strings are cast to empty strings", function () {
    const data = stringifySync([[" ", ""]], {
      quoted_string: true,
      quoted_empty: false,
      cast: { string: (value) => value.trim() },
    });
    data.should.eql(",\n");
  });

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
