import "should";
import { generate } from "../lib/index.js";
import { Writable } from "stream";

describe("api end", function () {
  it("no chunk generated after end", function (next) {
    let count = 0;
    let end;
    const generator = generate();
    generator.on("readable", () => {
      while (generator.read()) {
        if (end) {
          generator.emit("error", Error("Record emited after end"));
        }
        if (count++ === 5) {
          end = true;
          generator.end();
        }
      }
    });
    generator.on("error", next);
    generator.on("end", next);
  });

  it("no record generated after end", function (next) {
    let count = 0;
    let end;
    const generator = generate({ objectMode: true });
    generator.on("readable", () => {
      while (generator.read()) {
        if (end) {
          generator.emit("error", Error("Record emited after end"));
        }
        if (count++ === 5) {
          end = true;
          generator.end();
        }
      }
    });
    generator.on("error", next);
    generator.on("end", next);
  });

  it("sync read text", function (next) {
    const myReadable = new Writable({
      objectMode: true,
      write: (chunk, encoding, callback) => {
        callback();
      },
    });
    const generator = generate({
      length: 2,
      objectMode: true,
      highWaterMark: 10,
      columns: [() => "value"],
    });
    generator.pipe(myReadable).on("finish", () => {
      setTimeout(next, 1000);
    });
  });
});
