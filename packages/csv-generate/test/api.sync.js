import "should";
import { generate } from "../lib/sync.js";

describe("api sync", function () {
  it("throw error if options isn't provided", function () {
    (() => generate()).should.throw(
      "Invalid Argument: options must be an object or an integer",
    );
    (() => generate(3.14)).should.throw(
      "Invalid Argument: options must be an object or an integer",
    );
  });

  it("throw error if length isn't provided", function () {
    (() => generate({})).should.throw(
      "Invalid Argument: length is not defined",
    );
  });

  it("accept length as an integer", function () {
    const data = generate(1000);
    data.split(/\n/).length.should.eql(1000);
  });

  it("accept length as a string integer", function () {
    const data = generate("1000");
    data.split(/\n/).length.should.eql(1000);
  });

  it("honors objectMode", function () {
    const data = generate({ length: 1000, objectMode: true });
    data.length.should.eql(1000);
  });
});
