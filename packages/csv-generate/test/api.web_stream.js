import "should";
import { generate as generateStream } from "../lib/stream.js";
import { generate as generateClassic } from "../lib/index.js";

describe("api stream", function () {
  it.skip("perf classic", async function () {
    console.time("classic");
    const generator = generateClassic({
      objectMode: true,
      length: 10000000,
    });
    for await (const record of generator) {
      record;
      continue;
    }
    console.timeEnd("classic");
  });

  it.skip("perf stream", async function () {
    console.time("stream");
    const generator = generateStream({
      objectMode: true,
      length: 10000000,
    });
    const reader = generator.getReader();
    while (true) {
      const { done } = await reader.read();
      if (done) break;
    }
    console.timeEnd("stream");
  });

  it("perf stream with iterator", async function () {
    const generator = generateStream({
      objectMode: true,
      length: 10,
    });
    const records = [];
    for await (const record of generator) {
      records.push(record);
    }
    records.length.should.eql(10);
  });

  it("perf stream with reader", async function () {
    const generator = generateStream({
      objectMode: true,
      length: 10,
    });
    const records = [];
    const reader = generator.getReader();
    while (true) {
      const { done, record } = await reader.read();
      if (done) break;
      records.push(record);
    }
    records.length.should.eql(10);
  });
});
