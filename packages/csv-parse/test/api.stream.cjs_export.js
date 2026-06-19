import { strict as assert } from "node:assert";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);

describe("API stream CommonJS export", function () {
  it("loads the declared require target for csv-parse/stream", function () {
    const pkg = JSON.parse(
      readFileSync(new URL("../package.json", import.meta.url), "utf8"),
    );
    const target = pkg.exports["./stream"].require.default;
    const streamExport = require(
      fileURLToPath(new URL(`..${target.slice(1)}`, import.meta.url)),
    );
    assert.equal(typeof streamExport.parse, "function");
  });
});
