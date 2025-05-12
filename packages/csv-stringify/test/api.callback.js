import "should";
import { stringify } from "../lib/index.js";

describe("api.callback", function () {
  it("2 args: data, callback", function (next) {
    stringify(
      [
        ["field_1", "field_2"],
        ["value 1", "value 2"],
      ],
      (err, data) => {
        data.should.eql("field_1,field_2\nvalue 1,value 2\n");
        next();
      },
    );
  });

  it("2 args: options, callback", function (next) {
    const stringifier = stringify({ eof: false }, (err, data) => {
      data.should.eql("field_1,field_2\nvalue 1,value 2");
      next();
    });
    stringifier.write(["field_1", "field_2"]);
    stringifier.write(["value 1", "value 2"]);
    stringifier.end();
  });

  it("3 args: data, options, callback", function (next) {
    stringify(
      [
        ["field_1", "field_2"],
        ["value 1", "value 2"],
      ],
      { eof: false },
      (err, data) => {
        data.should.eql("field_1,field_2\nvalue 1,value 2");
        next();
      },
    );
  });

  it("catch error in end handler, see #386", function (next) {
    const input = Array.from({ length: 200000 }).map(() =>
      Array.from({ length: 100 }).map(
        () => "ABCDEFGHIJKLMNOPQRSTUVXYZ0123456789",
      ),
    );
    stringify(input, (err) => {
      err.should.match({
        code: "ERR_STRING_TOO_LONG",
        message: "Cannot create a string longer than 0x1fffffe8 characters",
      });
      next();
    });
  });
});
