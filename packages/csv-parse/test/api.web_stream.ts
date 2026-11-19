import "should";
import assert from "node:assert/strict";
import { parse as parseStream } from "../lib/stream.js";
import type { Options } from "../lib/stream.js";
import { CsvError } from "../lib/index.js";

describe("API Web Stream", function () {
  for (const castOption of ["cast", "cast_date"] as const) {
    for (const phase of ["write", "close"]) {
      it(`rejects ${phase} with the original ${castOption} error`, async function () {
        const error = new Error("conversion failed");
        const options: Options = { cast: true };
        options[castOption] = () => {
          throw error;
        };
        const stream = parseStream(options);
        const writer = stream.writable.getWriter();
        const reader = stream.readable.getReader();
        const readError = reader.read().catch((err) => err);
        const closedError = writer.closed.catch((err) => err);
        let operation;
        if (phase === "write") {
          operation = writer.write(Buffer.from("bad,next\n"));
        } else {
          await writer.write(Buffer.from("bad"));
          operation = writer.close();
        }
        await assert.rejects(operation, (err) => err === error);
        assert.equal(await readError, error);
        assert.equal(await closedError, error);
      });
    }
  }

  for (const phase of ["write", "close"]) {
    it(`rejects ${phase} with the original CSV syntax error`, async function () {
      const stream = parseStream();
      const writer = stream.writable.getWriter();
      const reader = stream.readable.getReader();
      const readError = reader.read().catch((err) => err);
      const closedError = writer.closed.catch((err) => err);
      let operation;
      if (phase === "write") {
        operation = writer.write(Buffer.from('bad"quote,next\n'));
      } else {
        await writer.write(Buffer.from('"unterminated'));
        operation = writer.close();
      }
      const error = await readError;
      await assert.rejects(operation, (err) => err === error);
      assert.ok(error instanceof CsvError);
      assert.equal(
        error.code,
        phase === "write" ? "INVALID_OPENING_QUOTE" : "CSV_QUOTE_NOT_CLOSED",
      );
      assert.equal(await closedError, error);
    });
  }

  describe("stream/web/TransformStream", function () {
    it("simple parse", async function () {
      const stream = parseStream();
      const writer = stream.writable.getWriter();
      const reader = stream.readable.getReader();
      await writer.write(Buffer.from("A,B,C\nD,E,F"));
      await writer.close();
      await reader.read().should.finally.eql({
        done: false,
        value: ["A", "B", "C"],
      });
      await reader.read().should.finally.eql({
        done: false,
        value: ["D", "E", "F"],
      });
      await reader.read().should.finally.eql({
        done: true,
        value: undefined,
      });
    });

    it("cat error parse", async function () {
      const stream = parseStream();
      const writer = stream.writable.getWriter();
      try {
        await writer.write(Buffer.from("A,B,C\nD,E"));
        await writer.close();
        throw Error("Shall not be called");
      } catch (err) {
        if (!(err instanceof CsvError)) {
          throw Error("Invalid error type", { cause: err });
        }
        err.code.should.eql("CSV_RECORD_INCONSISTENT_FIELDS_LENGTH");
      }
    });
  });
});
