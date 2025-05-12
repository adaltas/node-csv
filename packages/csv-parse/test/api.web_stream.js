import "should";
import { generate as generateStream } from "csv-generate/stream";
import { parse as parseStream } from "../lib/stream.js";

describe("api stream", function () {
  it.skip("perf classic", async function () {
    console.time("classic");
    // TODO: implement
    const generateClassic = () => {};
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
      const { done, value } = await reader.read();
      value;
      if (done) break;
    }
    // for await (const chunk of generator.getReader().read()) {
    //   console.log(Buffer.from(chunk).toString());
    // }
    console.timeEnd("stream");
  });

  it("perf stream with iterator", async function () {
    const generator = generateStream({
      objectMode: false,
      length: 5,
    });
    const parser = parseStream();
    const stream = generator.pipeThrough(parser);
    const records = [];
    for await (const record of stream) {
      records.push(record);
    }
    records.length.should.eql(5);
  });

  // it('perf stream with reader', async function() {
  //   const generator = generateStream({
  //     objectMode: true,
  //     length: 10
  //   });
  //   const records = [];
  //   const reader = generator.getReader();
  //   while (true) {
  //     const { done, record } = await reader.read();
  //     if (done) break;
  //     records.push(record);
  //   }
  //   records.length.should.eql(10);
  // });
});
