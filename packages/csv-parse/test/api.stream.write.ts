import "should";
import { parse } from "../lib/index.js";

describe("API write", function () {
  it("string randomly splited", function (next) {
    const records: string[] = [];
    const parser = parse();
    parser.on("readable", () => {
      let d;
      while ((d = parser.read())) {
        records.push(d);
      }
    });
    parser.on("end", () => {
      records.should.eql([
        ["Test 0", "0", '"'],
        ["Test 1", "1", '"'],
        ["Test 2", "2", '"'],
        ["Test 3", "3", '"'],
        ["Test 4", "4", '"'],
        ["Test 5", "5", '"'],
        ["Test 6", "6", '"'],
        ["Test 7", "7", '"'],
        ["Test 8", "8", '"'],
        ["Test 9", "9", '"'],
      ]);
      next();
    });
    let buffer = "";
    for (let i = 0; i < 10; i++) {
      buffer += "".concat(`Test ${i}`, ",", `${i}`, ",", '""""', "\n");
      if (buffer.length > 250) {
        parser.write(buffer.substring(0, 250));
        buffer = buffer.substring(250);
      }
    }
    parser.write(buffer);
    parser.end();
  });

  it("throw error if not writable", function (next) {
    const parser = parse();
    parser.on("error", (err) => {
      err.message.should.eql("write after end");
      next();
    });
    parser.write("abc,123");
    parser.end();
    parser.write("def,456");
  });

  it("support multi-bytes utf8 encoded characters", function (next) {
    const parser = parse((err, records) => {
      records[0][0].should.eql("€");
      next();
    });
    parser.write(Buffer.from([0xe2]));
    parser.write(Buffer.from([0x82]));
    parser.write(Buffer.from([0xac]));
    parser.end();
  });
});
