import "should";
import { generate } from "../lib/index.js";
import { generate as generateSync } from "../lib/sync.js";

describe("Option `fixed_size`", function () {
  it("emits the final buffered suffix only once", function () {
    generateSync({
      columns: [() => "abc"],
      length: 1,
      fixed_size: true,
      highWaterMark: 1,
    }).should.eql("abc");
  });

  it("drains buffered text before generating another record", function () {
    for (const highWaterMark of [1, 2, 3, 4, 7]) {
      generateSync({
        columns: [() => "abc"],
        length: 3,
        fixed_size: true,
        highWaterMark,
      }).should.eql("abc\nabc\nabc");
    }
  });

  it("preserves records across streamed chunk boundaries", async function () {
    const chunks = [];
    for await (const chunk of generate({
      columns: [() => "abc"],
      length: 3,
      fixed_size: true,
      highWaterMark: 1,
    })) {
      chunks.push(chunk);
    }
    Buffer.concat(chunks).toString().should.eql("abc\nabc\nabc");
  });

  it("preserves the final suffix and eof in the callback API", function (next) {
    generate(
      {
        columns: [() => "abc"],
        length: 2,
        fixed_size: true,
        highWaterMark: 2,
        row_delimiter: "|",
        eof: true,
      },
      (err, data) => {
        if (err) return next(err);
        data.toString().should.eql("abc|abc|");
        next();
      },
    );
  });

  it("with fixed_size", function (next) {
    let count = 0;
    const generator = generate({
      fixed_size: true,
      highWaterMark: 1024,
    });
    generator.on("readable", () => {
      let data;
      while ((data = generator.read())) {
        // First generated data is twice the high water mark, don't know why
        data.length.should.eql(1024);
        if (count++ === 100) {
          generator.end();
        }
      }
    });
    generator.on("error", next);
    generator.on("end", next);
  });
});
