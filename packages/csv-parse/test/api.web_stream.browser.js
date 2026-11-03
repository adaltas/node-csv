import assert from "node:assert/strict";
import {
  parse,
  CsvError,
  normalize_options,
} from "csv-parse/browser/esm/stream";

const collect = async (chunks, options) => {
  const input = new ReadableStream({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(chunk);
      controller.close();
    },
  });
  const records = [];
  for await (const record of input.pipeThrough(parse(options))) {
    records.push(record);
  }
  return records;
};

describe("API browser Web Stream", function () {
  it("uses the native TransformStream", function () {
    assert.ok(parse() instanceof TransformStream);
  });

  it("parses native byte chunks split inside BOM, Unicode and delimiters", async function () {
    const input = new TextEncoder().encode(
      '\ufeffname|@|value\r\n"café"|@|"雪\r\n山"\r\nfin|@|last',
    );
    const chunks = Array.from(input, (byte) => Uint8Array.of(byte));
    assert.deepEqual(
      await collect(chunks, { bom: true, columns: true, delimiter: "|@|" }),
      [
        { name: "café", value: "雪\r\n山" },
        { name: "fin", value: "last" },
      ],
    );
  });

  it("flushes a final record without a line ending", async function () {
    assert.deepEqual(await collect([new TextEncoder().encode("a,b")]), [
      ["a", "b"],
    ]);
  });

  it("handles empty input", async function () {
    assert.deepEqual(await collect([]), []);
  });

  it("reports parsing errors through the readable stream", async function () {
    await assert.rejects(collect([new TextEncoder().encode('"unterminated')]), {
      name: "Error",
      code: "CSV_QUOTE_NOT_CLOSED",
    });
  });

  it("exports CsvError and normalized options", function () {
    assert.throws(() => parse({ delimiter: 1 }), CsvError);
    assert.equal(normalize_options({ columns: true }).columns, true);
  });
});
