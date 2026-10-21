import "should";
import { Readable } from "node:stream";
import { generate } from "csv-generate";
import { parse } from "../lib/index.js";

describe("API stream.iterator", function () {
  for (const option of ["to", "to_line"]) {
    it(`stops at ${option} with separate input chunks`, async function () {
      const parser = Readable.from(["a,b\n", "c,d\n", "e,f\n", "g,h\n"]).pipe(
        parse({ [option]: 2 }),
      );
      const records = [];
      for await (const record of parser) {
        records.push(record);
      }
      records.should.eql([
        ["a", "b"],
        ["c", "d"],
      ]);
    });
  }

  it("classic", async function () {
    const parser = generate({ length: 10 }).pipe(parse());
    const records = [];
    for await (const record of parser) {
      records.push(record);
    }
    records.length.should.eql(10);
  });

  it("with iterator stopped in between", async function () {
    // See https://github.com/adaltas/node-csv/issues/333
    // See https://github.com/adaltas/node-csv/issues/410
    // Prevent `Error [ERR_STREAM_PREMATURE_CLOSE]: Premature close`
    const records = [];
    const parser = generate({ length: 10 }).pipe(
      parse({
        to_line: 2,
      }),
    );
    for await (const record of parser) {
      records.push(record);
    }
    records.length.should.eql(2);
  });
});
