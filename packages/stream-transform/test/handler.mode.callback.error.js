import "should";
import { Writable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { generate } from "csv-generate";
import { transform } from "../lib/index.js";

describe("handler.mode.callback.error", function () {
  it("with parallel 1", async function () {
    let count = 0;
    const consumer = new Writable({
      write: function (_, __, callback) {
        callback();
      },
    });
    try {
      await pipeline(
        generate({ length: 1000, highWaterMark: 1 }),
        transform(
          { parallel: 1, highWaterMark: 1 },
          function (chunk, callback) {
            setImmediate(function () {
              if (++count < 4) {
                callback(null, chunk);
              } else {
                callback(new Error("Catchme"));
              }
            });
          },
        ),
        consumer,
      );
      throw Error("Oh no!");
    } catch (err) {
      count.should.eql(4);
      err.message.should.eql("Catchme");
    }
  });

  it("handler with callback with parallel 10", async function () {
    let count = 0;
    const consumer = new Writable({
      objectMode: true,
      write: function (_, __, callback) {
        callback();
      },
    });
    try {
      await pipeline(
        generate({ length: 1000, objectMode: true }),
        transform({ parallel: 10 }, function (record, callback) {
          setTimeout(function () {
            if (++count < 4) {
              callback(null, record);
            } else {
              callback(new Error("Catchme"));
            }
          }, 10);
        }),
        consumer,
      );
      throw Error("Oh no!");
    } catch (err) {
      count.should.eql(4);
      err.message.should.eql("Catchme");
    }
  });
});
