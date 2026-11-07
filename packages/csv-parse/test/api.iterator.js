import assert from "node:assert/strict";
import { parse, CsvError, normalize_options } from "../lib/iterator.js";
import { parse as parseSync } from "../lib/sync.js";
import { parse as parseBrowser } from "../dist/esm/iterator.js";

async function* chunks(values) {
  for (const value of values) yield value;
}

async function collect(iterator) {
  const records = [];
  for await (const record of iterator) records.push(record);
  return records;
}

describe("API iterator", function () {
  it("emits every record in a chunk and the final unterminated record", async function () {
    const input = "a,b\nc,d\ne,f";
    assert.deepEqual(await collect(parse(chunks([input]))), parseSync(input));
  });

  it("handles empty input and empty chunks", async function () {
    assert.deepEqual(await collect(parse(chunks([]))), []);
    assert.deepEqual(
      await collect(parse(chunks(["", Buffer.alloc(0), new Uint8Array()]))),
      [],
    );
  });

  it("accepts strings, buffers and Uint8Array views", async function () {
    const bytes = new TextEncoder().encode("unused\nc,d\nunused");
    const view = bytes.subarray(7, 11);
    assert.deepEqual(
      await collect(parse(chunks(["a,b\n", view, Buffer.from("e,f")]))),
      [
        ["a", "b"],
        ["c", "d"],
        ["e", "f"],
      ],
    );
  });

  it("preserves BOM, UTF-8 and quoted records at every byte boundary", async function () {
    const input = Buffer.from('\ufeffname,note\r\n张三,"café\r\n🍊"\r\nZoë,終');
    const options = { bom: true, columns: true };
    const expected = parseSync(input, options);
    for (let cut = 0; cut <= input.length; cut++) {
      assert.deepEqual(
        await collect(
          parse(chunks([input.subarray(0, cut), input.subarray(cut)]), options),
        ),
        expected,
        `byte boundary ${cut}`,
      );
    }
  });

  it("uses the core encoding and custom delimiter options", async function () {
    const input = Buffer.from(
      "\ufeffname::value\r\n张三::1\r\nZoë::2",
      "utf16le",
    );
    const options = { bom: true, delimiter: "::", columns: true, cast: true };
    const expected = parseSync(input, options);
    for (let cut = 0; cut <= input.length; cut++) {
      assert.deepEqual(
        await collect(
          parse(chunks([input.subarray(0, cut), input.subarray(cut)]), options),
        ),
        expected,
        `byte boundary ${cut}`,
      );
    }
  });

  it("accepts native Buffer chunks in the browser distribution", async function () {
    const input = Buffer.from("\ufeffname,note\n张三,🍊\nZoë,café");
    const bytes = Array.from(input, (byte) => Buffer.from([byte]));
    assert.deepEqual(
      await collect(parseBrowser(chunks(bytes), { bom: true, columns: true })),
      parseSync(input, { bom: true, columns: true }),
    );
  });

  it("supports raw, info and binary field output", async function () {
    const input = Buffer.from("a,b\nc,d");
    const options = { raw: true, info: true, encoding: null };
    assert.deepEqual(
      await collect(parse(chunks([input]), options)),
      parseSync(input, options),
    );
  });

  it("yields objname tuples like the streaming API", async function () {
    const input = "id,value\na,1\nb,2";
    const options = { columns: true, objname: "id" };
    assert.deepEqual(
      await collect(parse(chunks([input]), options)),
      Object.entries(parseSync(input, options)),
    );
  });

  it("applies columns, cast, comments and on_record", async function () {
    const input = "# ignored\nname,value\n Alice ,1\n Bob ,2\n";
    const options = {
      columns: true,
      cast: true,
      comment: "#",
      trim: true,
      on_record: (record) => (record.value === 1 ? null : record),
    };
    assert.deepEqual(
      await collect(parse(chunks([input]), options)),
      parseSync(input, options),
    );
  });

  it("preserves skip callbacks and recoverable errors", async function () {
    const skipped = [];
    const options = {
      skip_records_with_error: true,
      on_skip: (error) => skipped.push(error.code),
    };
    assert.deepEqual(await collect(parse(chunks(["a,b\nx\nc,d\n"]), options)), [
      ["a", "b"],
      ["c", "d"],
    ]);
    assert.deepEqual(skipped, ["CSV_RECORD_INCONSISTENT_FIELDS_LENGTH"]);
  });

  it("is lazy and drains a chunk before pulling the next", async function () {
    let reads = 0;
    async function* input() {
      reads++;
      yield "first\nsecond\nthird\n";
      reads++;
      yield "fourth\n";
    }
    const records = parse(input());
    assert.equal(reads, 0);
    assert.deepEqual((await records.next()).value, ["first"]);
    assert.deepEqual((await records.next()).value, ["second"]);
    assert.equal(reads, 1);
    await records.return();
  });

  it("closes the source on consumer break with queued records", async function () {
    let reads = 0;
    let closed = false;
    async function* input() {
      try {
        reads++;
        yield "a,b\nc,d\ne,f\n";
        reads++;
        yield "g,h\n";
      } finally {
        await Promise.resolve();
        closed = true;
      }
    }
    for await (const record of parse(input())) {
      assert.deepEqual(record, ["a", "b"]);
      break;
    }
    assert.equal(reads, 1);
    assert.equal(closed, true);
  });

  it("awaits cleanup on explicit consumer return", async function () {
    let closed = false;
    async function* input() {
      try {
        yield "a,b\nc,d\ne,f\n";
      } finally {
        await Promise.resolve();
        closed = true;
      }
    }
    const records = parse(input());
    await records.next();
    assert.deepEqual(await records.return(), { done: true, value: undefined });
    assert.equal(closed, true);
  });

  it("propagates a source error", async function () {
    const error = new Error("source failed");
    async function* input() {
      yield "a,b\nc,d\n";
      throw error;
    }
    await assert.rejects(collect(parse(input())), (caught) => caught === error);
  });

  it("yields pre-error records and closes iterators without throw", async function () {
    let reads = 0;
    let returns = 0;
    const input = {
      [Symbol.asyncIterator]() {
        return this;
      },
      async next() {
        reads++;
        return { done: false, value: "a,b\nc,d\nx\nnext,row\n" };
      },
      async return() {
        await Promise.resolve();
        returns++;
        return { done: true };
      },
    };
    const records = [];
    await assert.rejects(
      async () => {
        for await (const record of parse(input)) records.push(record);
      },
      { code: "CSV_RECORD_INCONSISTENT_FIELDS_LENGTH" },
    );
    assert.deepEqual(records, [
      ["a", "b"],
      ["c", "d"],
    ]);
    assert.equal(reads, 1);
    assert.equal(returns, 1);
  });

  it("reports errors from the EOF flush", async function () {
    await assert.rejects(collect(parse(chunks(['a,b\n"unclosed']))), {
      code: "CSV_QUOTE_NOT_CLOSED",
    });
  });

  it("stops and closes the source at record or line limits", async function () {
    for (const options of [{ to: 2 }, { to_line: 2 }]) {
      let reads = 0;
      let closed = false;
      async function* input() {
        try {
          reads++;
          yield "1\n2\n3\n4\n";
          reads++;
          throw new Error("must not read past the limit");
        } finally {
          await Promise.resolve();
          closed = true;
        }
      }
      assert.deepEqual(await collect(parse(input(), options)), [["1"], ["2"]]);
      assert.equal(reads, 1);
      assert.equal(closed, true);
    }
  });

  it("exports the common error and normalization helpers", async function () {
    assert.equal(
      normalize_options({ delimiter: ":" }).delimiter[0].toString(),
      ":",
    );
    await assert.rejects(collect(parse(chunks(['"unclosed']))), CsvError);
  });
});
