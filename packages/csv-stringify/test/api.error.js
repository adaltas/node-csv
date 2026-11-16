import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

describe("api.error", function () {
  for (const api of ["callback", "write", "pipeline"]) {
    for (const operation of ["field access", "column discovery"]) {
      it(`reports errors from ${operation} through the ${api} API`, function () {
        const result = spawnSync(
          process.execPath,
          [
            "--input-type=module",
            "--eval",
            `
              import assert from "node:assert/strict";
              import { Readable, Writable } from "node:stream";
              import { pipeline } from "node:stream/promises";
              import { stringify } from ${JSON.stringify(new URL("../lib/index.js", import.meta.url).href)};

              const error = new Error("Cannot read record");
              const record = ${JSON.stringify(operation)} === "field access"
                ? { get value() { throw error; } }
                : new Proxy({}, { ownKeys() { throw error; } });
              if (${JSON.stringify(api)} === "callback") {
                let calls = 0;
                await new Promise((resolve) => {
                  stringify([record], (err, data) => {
                    calls++;
                    assert.equal(err, error);
                    assert.equal(data, undefined);
                    resolve();
                  });
                });
                await new Promise((resolve) => setImmediate(resolve));
                assert.equal(calls, 1);
              } else if (${JSON.stringify(api)} === "write") {
                const stream = stringify();
                const failure = new Promise((resolve) => stream.once("error", resolve));
                assert.doesNotThrow(() => stream.write(record));
                assert.equal(await failure, error);
              } else {
                await assert.rejects(
                  pipeline(
                    Readable.from([record]),
                    stringify(),
                    new Writable({ write: (_, __, next) => next() }),
                  ),
                  (err) => err === error,
                );
              }
            `,
          ],
          { encoding: "utf8", timeout: 5000 },
        );
        assert.equal(result.status, 0, result.stderr);
      });
    }
  }
});
