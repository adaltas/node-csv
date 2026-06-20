import assert from "node:assert";
// Node.js >= 14
import { parse } from "csv-parse/stream";
// Node.js < 14
// import { parse } from 'csv-parse/dist/cjs/stream'

(async function () {
  const output: string[][] = [];
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
})().catch(function (err: unknown) {
  console.error(err);
  process.exitCode = 1;
});
