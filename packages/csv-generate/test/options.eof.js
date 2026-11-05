import "should";
import { generate } from "../lib/index.js";
import { generate as generateSync } from "../lib/sync.js";
import { generate as generateStream } from "../lib/stream.js";

describe("Option `eof`", function () {
  it("preserves a custom suffix after an overflowing final record", function (next) {
    generate(
      {
        columns: [() => "xx"],
        length: 2,
        highWaterMark: 3,
        eof: "END",
      },
      (err, data) => {
        if (err) return next(err);
        data.toString().should.eql("xx\nxxEND");
        next();
      },
    );
  });

  it("emits eof once across synchronous read boundaries", function () {
    for (const highWaterMark of [1, 2, 3, 4, 5, 6]) {
      for (const fixed_size of [false, true]) {
        generateSync({
          columns: [() => "xx"],
          length: 2,
          highWaterMark,
          fixed_size,
          eof: "END",
        }).should.eql("xx\nxxEND");
      }
    }
  });

  it("preserves a custom row delimiter as eof in streamed output", async function () {
    const chunks = [];
    for await (const chunk of generate({
      columns: [() => "xx"],
      length: 1,
      highWaterMark: 1,
      row_delimiter: "\r\n",
      eof: true,
      sleep: 1,
    })) {
      chunks.push(chunk);
    }
    Buffer.concat(chunks).toString().should.eql("xx\r\n");
  });

  it("preserves eof after overflowing a web stream read", async function () {
    const field = "x".repeat(1024);
    const chunks = [];
    for await (const chunk of generateStream({
      columns: [() => field],
      length: 2,
      eof: "END",
    })) {
      chunks.push(chunk);
    }
    Buffer.concat(chunks).toString().should.eql(`${field}\n${field}END`);
  });

  it("leaves empty output empty", function () {
    generateSync({ length: 0, eof: "END" }).should.eql("");
  });

  it("does not append eof to object records", function () {
    generateSync({
      columns: [() => "xx"],
      length: 1,
      objectMode: true,
      highWaterMark: 1,
      eof: "END",
    }).should.eql([["xx"]]);
  });

  it("default to trailing newline character if true", function (next) {
    generate(
      {
        eof: true,
        length: 10,
        encoding: "ascii",
      },
      (err, data) => {
        if (!err) {
          data.split("\n")[10].should.eql("");
        }
        next(err);
      },
    );
  });

  it("accept any string", function (next) {
    generate(
      {
        eof: "abcd",
        length: 10,
        encoding: "ascii",
      },
      (err, data) => {
        if (!err) {
          data.split("abcd")[1].should.eql("");
        }
        next(err);
      },
    );
  });
});
