import "should";
import stream from "stream";
import util from "util";
import { generate } from "../lib/index.js";

describe("api pipe", function () {
  it("to a custom writer", function (next) {
    this.timeout(1000000);
    const Writer = function () {
      stream.Writable.call(this);
      this._data = "";
      return this;
    };
    util.inherits(Writer, stream.Writable);
    Writer.prototype._write = function (chunk, encoding, callback) {
      this._data += chunk.toString();
      callback();
    };
    const writer = new Writer();
    writer.on("finish", () => {
      writer._data.split("\n").length.should.eql(3);
      next();
    });
    const generator = generate({ length: 3 });
    generator.pipe(writer);
  });
});
