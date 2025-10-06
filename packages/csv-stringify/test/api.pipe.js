import "should";
import fs from "fs";
import { generate } from "csv-generate";
import { stringify } from "../lib/index.js";

describe("API pipe", function () {
  it("pipe from source to destination", function (next) {
    const generator = generate({
      length: 2,
      objectMode: true,
      seed: 1,
      columns: 2,
    });
    const stringifier = stringify({ eof: false });
    const ws = fs.createWriteStream("/tmp/large.out");
    generator
      .pipe(stringifier)
      .pipe(ws)
      .on("finish", () => {
        fs.readFile("/tmp/large.out", "ascii", (err, data) => {
          data.should.eql("OMH,ONKCHhJmjadoA\nD,GeACHiN");
          fs.unlink("/tmp/large.out", next);
        });
      });
  });

  it("pipe to destination", function (next) {
    generate(
      { length: 1000, objectMode: true, seed: 1, columns: 2 },
      (err, data) => {
        const stringifier = stringify({ eof: false });
        const ws = fs.createWriteStream("/tmp/large.out");
        stringifier.pipe(ws);
        for (const row of data) {
          stringifier.write(row);
        }
        stringifier.end();
        ws.on("finish", () => {
          fs.readFile("/tmp/large.out", "ascii", (err, data) => {
            if (!err) {
              data.split("\n").length.should.eql(1000);
            }
            next(err);
          });
        });
      },
    );
  });

  it("pipe from source", function (next) {
    let data = "";
    const generator = generate({
      length: 2,
      objectMode: true,
      seed: 1,
      columns: 2,
    });
    const stringifier = generator.pipe(stringify({ eof: false }));
    stringifier.on("readable", () => {
      let d;
      while ((d = stringifier.read())) {
        data += d;
      }
    });
    stringifier.on("finish", () => {
      data.should.eql("OMH,ONKCHhJmjadoA\nD,GeACHiN");
      next();
    });
  });
});
