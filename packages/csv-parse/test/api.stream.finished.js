import "should";
import { Readable } from "node:stream";
import * as stream from "node:stream/promises";
import { generate } from "csv-generate";
import { parse } from "../lib/index.js";

describe("API stream.finished", function () {
  it("resolved at the end", async function () {
    // See https://github.com/adaltas/node-csv/issues/333
    const records = [];
    const parser = generate({ length: 10 }).pipe(parse());
    parser.on("readable", () => {
      let record;
      while ((record = parser.read()) !== null) {
        records.push(record);
      }
    });
    await stream.finished(parser);
    records.length.should.eql(10);
  });

  it("aborted (with generate())", async function () {
    // See https://github.com/adaltas/node-csv/issues/333
    // See https://github.com/adaltas/node-csv/issues/410
    // Prevent `Error [ERR_STREAM_PREMATURE_CLOSE]: Premature close`
    const records = [];
    const parser = generate({ length: 10 }).pipe(parse({ to_line: 3 }));
    parser.on("readable", () => {
      let record;
      while ((record = parser.read()) !== null) {
        records.push(record);
      }
    });
    await stream.finished(parser);
    records.length.should.eql(3);
  });

  it.skip("aborted (with Readable)", async function () {
    // See https://github.com/adaltas/node-csv/issues/333
    // See https://github.com/adaltas/node-csv/issues/410
    // Prevent `Error [ERR_STREAM_PREMATURE_CLOSE]: Premature close`
    const records = [];
    const reader = new Readable({
      highWaterMark: 10,
      read: function (size) {
        for (let i = 0; i < size; i++) {
          this.push(`${size},${i}\n`);
        }
      },
    });
    const parser = reader.pipe(parse({ to_line: 3 }));
    parser.on("readable", () => {
      let record;
      while ((record = parser.read()) !== null) {
        records.push(record);
      }
    });
    await stream.finished(parser);
    console.log(records);
    records.length.should.eql(3);
  });

  it("rejected on error", async function () {
    const parser = parse({ to_line: 3 });
    parser.write("a,b,c\n");
    parser.write("d,e,f\n");
    parser.write("h,i,j,ohno\n");
    parser.write("k,l,m\n");
    parser.end();
    parser.on("readable", () => {
      while (parser.read() !== null) true;
    });
    stream.finished(parser).should.be.rejectedWith({
      code: "CSV_RECORD_INCONSISTENT_FIELDS_LENGTH",
    });
  });
});
