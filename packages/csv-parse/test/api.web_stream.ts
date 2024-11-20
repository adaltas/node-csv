import "should";
import { parse as parseStream } from "../lib/stream.js";
import { CsvError } from "../lib/index.js";

describe("API Web Stream", () => {
  describe("stream/web/TransformStream", () => {
    it("simple parse", async () => {
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
          throw Error("Invalid error type");
        }
        err.code.should.eql("CSV_RECORD_INCONSISTENT_FIELDS_LENGTH");
      }
    });
  });
});
