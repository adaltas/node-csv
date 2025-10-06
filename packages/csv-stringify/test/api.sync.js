import "should";
import { stringify } from "../lib/sync.js";

describe("sync", function () {
  it("work on object", function () {
    const data = stringify([
      { a: "1", b: "2" },
      { a: "3", b: "4" },
    ]);
    data.should.eql("1,2\n3,4\n");
  });

  it("work on array", function () {
    const data = stringify([
      ["1", "2"],
      ["3", "4"],
    ]);
    data.should.eql("1,2\n3,4\n");
  });

  it("pass options", function () {
    const data = stringify(
      [
        { a: "1", b: "2" },
        { a: "3", b: "4" },
      ],
      { quoted: true, eof: false },
    );
    data.should.eql('"1","2"\n"3","4"');
  });

  it("catch error", function () {
    (() => {
      stringify([1, { a: "3", b: "4" }]);
    }).should.throw("Invalid Record: expect an array or an object, got 1");
  });
});
