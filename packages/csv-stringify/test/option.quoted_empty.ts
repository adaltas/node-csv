import "should";
import { stringify } from "../lib/index.js";

describe("Option `quoted_empty`", function () {
  it("quotes empty fields (when all not quoted)", function (next) {
    let count = 0;
    let data = "";
    const stringifier = stringify({
      quoted: false,
      quoted_empty: true,
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
      data.should.eql('"","","", ,0,""');
      next();
    });
    stringifier.write([undefined, null, "", " ", 0, false]);
    stringifier.end();
  });

  it("quotes empty fields (when strings quoted)", function (next) {
    let count = 0;
    let data = "";
    const stringifier = stringify({
      quoted_empty: true,
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
      data.should.eql('"","",""," ",0,""');
      next();
    });
    stringifier.write([undefined, null, "", " ", 0, false]);
    stringifier.end();
  });

  it("prevents quoting empty fields (when strings quoted)", function (next) {
    let count = 0;
    let data = "";
    const stringifier = stringify({
      quoted_empty: false,
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
      data.should.eql(',,," ",0,');
      next();
    });
    stringifier.write([undefined, null, "", " ", 0, false]);
    stringifier.end();
  });

  it("quotes empty fields (when all quoted)", function (next) {
    let count = 0;
    let data = "";
    const stringifier = stringify({
      quoted: true,
      quoted_empty: true,
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
      data.should.eql('"","",""," ","0",""');
      next();
    });
    stringifier.write([undefined, null, "", " ", 0, false]);
    stringifier.end();
  });
});
