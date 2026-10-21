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

  it("aborted (with Readable)", async function () {
    // See https://github.com/adaltas/node-csv/issues/333
    // See https://github.com/adaltas/node-csv/issues/410
    // Prevent `Error [ERR_STREAM_PREMATURE_CLOSE]: Premature close`
    const records: string[] = [];
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
    try {
      await stream.finished(parser);
      records.length.should.eql(3);
    } finally {
      reader.destroy();
    }
  });

  for (const option of ["to", "to_line"]) {
    it(`finishes after ${option} while the consumer pauses`, async function () {
      const records: string[][] = [];
      let produced = 0;
      const reader = Readable.from(
        (function* () {
          for (let i = 0; i < 1000; i++) {
            produced++;
            yield `${i},value${i}\n`;
          }
        })(),
        { highWaterMark: 1 },
      );
      const options =
        option === "to"
          ? { to: 1, highWaterMark: 1 }
          : { to_line: 1, highWaterMark: 1 };
      const parser = parse(options);
      const done = stream.finished(parser);
      parser.on("data", (record) => {
        records.push(record);
        parser.pause();
        setImmediate(() => parser.resume());
      });
      reader.pipe(parser);
      try {
        await done;
        records.should.eql([["0", "value0"]]);
        produced.should.be.below(10);
      } finally {
        reader.destroy();
      }
    });

    it(`resolves after ${option} with separate input chunks`, async function () {
      const records: string[][] = [];
      const parser = Readable.from(["a,b\n", "c,d\n", "e,f\n", "g,h\n"]).pipe(
        parse({ [option]: 2 }),
      );
      parser.on("readable", () => {
        let record;
        while ((record = parser.read()) !== null) {
          records.push(record);
        }
      });
      await stream.finished(parser);
      records.should.eql([
        ["a", "b"],
        ["c", "d"],
      ]);
    });
  }

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
