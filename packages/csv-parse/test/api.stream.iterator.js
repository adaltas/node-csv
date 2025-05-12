import "should";
import { generate } from "csv-generate";
import { parse } from "../lib/index.js";

describe("API stream.iterator", function () {
  it("classic", async function () {
    const parser = generate({ length: 10 }).pipe(parse());
    const records = [];
    for await (const record of parser) {
      records.push(record);
    }
    records.length.should.eql(10);
  });

  it("with iteractor stoped in between", async function () {
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
