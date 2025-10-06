import "should";
import { Writable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { generate } from "csv-generate";
import { transform } from "../lib/index.js";

describe("handler.mode.callback", function () {
  it("handler with callback with parallel 1", async function () {
    const chunks = [];
    const consumer = new Writable({
      write: function (chunk, _, callback) {
        chunks.push(chunk.toString());
        callback();
      },
    });
    await pipeline(
      generate({ length: 1000 }),
      transform({ parallel: 1 }, function (chunk, callback) {
        setImmediate(function () {
          callback(null, chunk);
        });
      }),
      consumer,
    );
    chunks.join("").split("\n").length.should.eql(1000);
  });

  it("handler with callback with parallel 2", async function () {
    let count = 0;
    const clear = setInterval(function () {
      count++;
    }, 10);
    const chunks = [];
    const consumer = new Writable({
      write: function (chunk, _, callback) {
        chunks.push(chunk.toString());
        callback();
      },
    });
    await pipeline(
      generate({
        columns: 10,
        objectMode: true,
        length: 1000,
        seed: true,
      }),
      transform({ parallel: 2 }, function (chunk, callback) {
        setTimeout(function () {
          callback(null, JSON.stringify(chunk) + "\n");
        }, 1);
      }),
      consumer,
    );
    clearInterval(clear);
    count.should.be.above(1);
  });
});
