import "should";
import fs from "fs";
import { Readable } from "stream";
import { generate } from "csv-generate";
import { parse, CsvError } from "../lib/index.js";

describe("API pipe", function () {
  it("piping in and reading out", function (next) {
    let finished = false;
    const parser = parse();
    const records: string[] = [];
    const generator = generate({
      length: 2,
      seed: 1,
      columns: 2,
      fixed_size: true,
    });
    parser.on("readable", () => {
      let d;
      while ((d = parser.read())) {
        records.push(d);
      }
    });
    parser.on("end", () => {
      finished = true;
    });
    parser.on("end", () => {
      finished.should.be.ok;
      records.should.eql([
        ["OMH", "ONKCHhJmjadoA"],
        ["D", "GeACHiN"],
      ]);
      next();
    });
    generator.pipe(parser);
  });

  it("piping in and callback out", function (next) {
    const generator = generate({
      length: 2,
      seed: 1,
      columns: 2,
      fixed_size: true,
    });
    generator.pipe(
      parse((err, records) => {
        records.should.eql([
          ["OMH", "ONKCHhJmjadoA"],
          ["D", "GeACHiN"],
        ]);
        next();
      }),
    );
  });

  it("catch source error", function (next) {
    const parser = parse();
    parser.on("error", () => {
      next(new Error("Should not pass here"));
    });
    parser.on("end", () => {
      next(new Error("Should not pass here"));
    });
    const rs = fs.createReadStream("/doesnotexist");
    rs.on("error", (err) => {
      (err as CsvError).code.should.eql("ENOENT");
      next();
    });
    rs.pipe(parser);
  });

  it("handle empty string", function (next) {
    const s = new Readable();
    s._read = () => {
      s.push(null);
    };
    s.pipe(
      parse(
        {
          delimiter: ",",
        },
        (err, records) => {
          if (!err) records.should.eql([]);
          next(err);
        },
      ),
    );
  });
});
