import "should";
import dedent from "dedent";
import { stringify } from "../lib/index.js";

describe("API write", function () {
  it("arrays", function (next) {
    let count = 0;
    let data = "";
    const stringifier = stringify({ eof: false });
    stringifier.on("readable", () => {
      let d;
      while ((d = stringifier.read())) {
        data += d;
      }
    });
    stringifier.on("record", (record, index) => {
      record.should.be.an.instanceof(Array);
      count.should.eql(index);
      count++;
    });
    stringifier.on("finish", () => {
      count.should.eql(10);
      data.should.eql(
        dedent`
          Test 0,0,""""
          Test 1,1,""""
          Test 2,2,""""
          Test 3,3,""""
          Test 4,4,""""
          Test 5,5,""""
          Test 6,6,""""
          Test 7,7,""""
          Test 8,8,""""
          Test 9,9,""""
        `,
      );
      next();
    });
    for (let i = 0; i < 10; i++) {
      stringifier.write([`Test ${i}`, i, '"']);
    }
    stringifier.end();
  });

  it("objects with column options", function (next) {
    let count = 0;
    let data = "";
    const stringifier = stringify({
      columns: ["name", "value", "escape"],
      eof: false,
    });
    stringifier.on("readable", () => {
      let d;
      while ((d = stringifier.read())) {
        data += d;
      }
    });
    stringifier.on("record", (record, index) => {
      record.should.be.an.Object();
      record.should.not.be.an.instanceOf(Array);
      count.should.eql(index);
      count++;
    });
    stringifier.on("finish", () => {
      count.should.eql(10);
      data.should.eql(
        dedent`
          Test 0,0,""""
          Test 1,1,""""
          Test 2,2,""""
          Test 3,3,""""
          Test 4,4,""""
          Test 5,5,""""
          Test 6,6,""""
          Test 7,7,""""
          Test 8,8,""""
          Test 9,9,""""
        `,
      );
      next();
    });
    for (let i = 0; i < 10; i++) {
      stringifier.write({
        name: `Test ${i}`,
        value: i,
        escape: '"',
        ovni: `ET ${i}`,
      });
    }
    stringifier.end();
  });

  it("throw error if not writable", function (next) {
    const stringifier = stringify();
    stringifier.on("error", (err) => {
      err.message.should.eql("write after end");
      next();
    });
    stringifier.write(["abc", "123"]);
    stringifier.end();
    stringifier.write(["def", "456"]);
  });

  it("accepts full write API", function (next) {
    const stringifier = stringify();
    stringifier.on("finish", () => {
      next();
    });
    stringifier.write(["abc", "123"], "utf8", () => {
      stringifier.end();
    });
  });

  it("write invalid record null", function (next) {
    const stringifier = stringify();
    stringifier.on("error", (err) => {
      // Until Node.js 13
      err.message.should.eql("May not write null values to stream");
      next();
    });
    stringifier.on("end", () => {
      next(Error("Oh no!"));
    });
    try {
      stringifier.write(null, "utf8", () => {
        stringifier.end();
      });
    } catch (err) {
      // Since Node.js 14
      err.message.should.eql("May not write null values to stream");
      next();
    }
  });

  it("write invalid record true", function (next) {
    const stringifier = stringify();
    stringifier.on("error", (err) => {
      err.message.should.eql(
        "Invalid Record: expect an array or an object, got true",
      );
      next();
    });
    stringifier.on("end", () => {
      next(Error("Oh no!"));
    });
    stringifier.write(true, "utf8", () => {
      stringifier.end();
    });
  });

  describe("input", function () {
    it("array are immutable", function (next) {
      const chunks = [
        ["a", "b"],
        ["c", "d"],
      ];
      stringify(chunks, (err) => {
        if (!err)
          chunks.should.eql([
            ["a", "b"],
            ["c", "d"],
          ]);
        next(err);
      });
    });

    it("object (with columns are immutable", function (next) {
      const chunks = [
        { a: 1, b: 2 },
        { a: 3, b: 4 },
      ];
      stringify(chunks, { columns: ["b"] }, (err) => {
        if (!err)
          chunks.should.eql([
            { a: 1, b: 2 },
            { a: 3, b: 4 },
          ]);
        next(err);
      });
    });

    it("object (without columns) are immutable", function (next) {
      const chunks = [
        { a: 1, b: 2 },
        { a: 3, b: 4 },
      ];
      stringify(chunks, (err) => {
        if (!err)
          chunks.should.eql([
            { a: 1, b: 2 },
            { a: 3, b: 4 },
          ]);
        next(err);
      });
    });
  });
});
