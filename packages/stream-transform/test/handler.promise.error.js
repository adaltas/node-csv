import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

describe("handler.promise.error", function () {
  for (const api of ["callback", "pipeline"]) {
    it(`handles rejected promises with the ${api} API`, function () {
      const result = spawnSync(
        process.execPath,
        [
          "--unhandled-rejections=strict",
          "--input-type=module",
          "--eval",
          `
            import assert from "node:assert/strict";
            import { Readable, Writable } from "node:stream";
            import { pipeline } from "node:stream/promises";
            import { transform } from ${JSON.stringify(new URL("../lib/index.js", import.meta.url).href)};

            const error = new Error("Catchme");
            const handler = async (record) => {
              throw error;
            };
            if (${JSON.stringify(api)} === "callback") {
              await new Promise((resolve) => {
                transform([["value"]], handler, (err) => {
                  assert.equal(err, error);
                  resolve();
                });
              });
            } else {
              await assert.rejects(
                pipeline(
                  Readable.from([["value"]]),
                  transform(handler),
                  new Writable({ objectMode: true, write: (_, __, next) => next() }),
                ),
                (err) => err === error,
              );
            }
          `,
        ],
        { encoding: "utf8" },
      );
      assert.equal(result.status, 0, result.stderr);
    });
  }
});
