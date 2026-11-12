import "should";
import { Stringifier, stringify } from "csv-stringify/browser/esm";
import { stringify as stringifySync } from "csv-stringify/browser/esm/sync";

describe("Browser ESM API", function () {
  it("stringifies records with a callback", function (next) {
    stringify(
      [{ name: "first", value: 1 }],
      { header: true },
      function (err, output) {
        if (err) return next(err);
        output.should.eql("name,value\nfirst,1\n");
        next();
      },
    );
  });

  it("exposes the readable and writable stream API", function (next) {
    const stream = new Stringifier({ delimiter: ";" });
    stream.setEncoding("utf8").pause().resume();
    let output = "";
    stream.on("data", function (chunk) {
      output += chunk;
    });
    stream.on("error", next);
    stream.on("end", function () {
      output.should.eql("first;1\nsecond;2\n");
      next();
    });
    stream.cork();
    stream.write(["first", 1]).should.be.a.Boolean();
    stream.write(["second", 2]).should.be.a.Boolean();
    stream.uncork();
    stream.end();
  });

  it("stringifies records synchronously", function () {
    stringifySync([["first", 1]], { delimiter: ";" }).should.eql("first;1\n");
  });
});
