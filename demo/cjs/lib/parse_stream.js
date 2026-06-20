const assert = require("node:assert");
const version = parseInt(/^v(\d+)/.exec(process.version)[1], 10);
const { parse } = require(
  version >= 14 ? "csv-parse/stream" : "csv-parse/dist/cjs/stream.cjs",
);

(async function () {
  const output = [];
  const parser = parse({
    delimiter: ":",
  });
  const writer = parser.writable.getWriter();
  const reader = parser.readable.getReader();
  const encoder = new TextEncoder();
  const read = (async function () {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      output.push(value);
    }
  })();

  await writer.write(encoder.encode("a:b:c\n"));
  await writer.write(encoder.encode("1:2:3\n"));
  await writer.close();
  await read;

  assert.deepStrictEqual(output, [
    ["a", "b", "c"],
    ["1", "2", "3"],
  ]);
})().catch(function (err) {
  console.error(err);
  process.exitCode = 1;
});
