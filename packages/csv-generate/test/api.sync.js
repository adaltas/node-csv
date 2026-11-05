import assert from "node:assert/strict";
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

  for (const value of [true, undefined, {}]) {
    it(`throws for unsupported column value ${JSON.stringify(value)}`, function () {
      (() => generate({ length: 1, columns: [() => value] })).should.throw(
        /^INVALID_VALUE:/,
      );
    });
  }

  it("throws instead of returning partially generated records", function () {
    (() =>
      generate({
        length: 2,
        columns: [({ state }) => (state.count_created === 0 ? "ok" : true)],
      })).should.throw(/^INVALID_VALUE:/);
  });

  it("preserves errors thrown by column functions", function () {
    const error = new Error("column failed");
    assert.throws(
      () =>
        generate({
          length: 1,
          columns: [
            () => {
              throw error;
            },
          ],
        }),
      (caught) => caught === error,
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
