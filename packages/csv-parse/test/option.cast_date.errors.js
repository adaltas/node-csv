import assert from "node:assert/strict";
import { parse } from "../lib/index.js";
import { parse as parseSync } from "../lib/sync.js";

describe("Option `cast_date` errors", function () {
  for (const input of ["bad,next\n", "good,bad", "good,date\nbad,next\n"]) {
    for (const skip_records_with_error of [false, true]) {
      it(`reports an error from ${JSON.stringify(input)} with skip=${skip_records_with_error}`, async function () {
        const error = new Error("date conversion failed");
        const callbackErrors = [];
        const streamErrors = [];
        const parser = parse(
          {
            cast: true,
            skip_records_with_error,
            cast_date(value) {
              if (value === "bad") throw error;
              return value;
            },
          },
          (err) => callbackErrors.push(err),
        );
        parser.on("error", (err) => streamErrors.push(err));
        const closed = new Promise((resolve) => parser.on("close", resolve));
        assert.doesNotThrow(() => parser.end(input));
        await closed;
        assert.deepEqual(callbackErrors, [error]);
        assert.deepEqual(streamErrors, [error]);
      });
    }
  }

  it("continues to throw the original error from the sync API", function () {
    const error = new Error("date conversion failed");
    let thrown;
    try {
      parseSync("bad", {
        cast: true,
        cast_date() {
          throw error;
        },
      });
    } catch (err) {
      thrown = err;
    }
    assert.equal(thrown, error);
  });
});
