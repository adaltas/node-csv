import "should";
import { generate } from "csv-generate";
import { parse } from "../lib/index.js";

describe("info bytes", function () {
  it("info only", async function () {
    const parser = parse({
      info: true,
    });
    parser.write(Buffer.from("1,2\n"));
    parser.write(Buffer.from("3,4\n"));
    parser.write(Buffer.from("5,6\n"));
    parser.write(Buffer.from("7,8\n"));
    parser.end();
    const bytes: number[] = [];
    for await (const { info } of parser) {
      bytes.push(info.bytes);
    }
    bytes.should.eql([4, 8, 12, 16]);
  });

  it("info with bom, columns and from_line", async function () {
    const parser = parse({
      columns: true,
      bom: true,
      from_line: 2,
      info: true,
    });
    parser.write(Buffer.from("\ufeffa,b\n"));
    parser.write(Buffer.from("1,2\n"));
    parser.write(Buffer.from("3,4\n"));
    parser.write(Buffer.from("5,6\n"));
    parser.write(Buffer.from("7,8\n"));
    parser.end();
    const bytes: number[] = [];
    for await (const { info } of parser) {
      bytes.push(info.bytes);
    }
    bytes.should.eql([15, 19, 23]);
  });

  it("available inside fields", async function () {
    const parser = generate({
      length: 3,
      seed: 1,
      columns: 2,
      fixed_size: true,
    }).pipe(
      parse({
        cast: (value, info) => {
          return info.bytes;
        },
      }),
    );
    // await Array.fromAsync(parser).should.finally.eql(...)
    const records: [number, number][] = [];
    for await (const record of parser) {
      records.push(record);
    }
    records.should.eql([
      [3, 17],
      [19, 27],
      [33, 40],
    ]);
  });
});
