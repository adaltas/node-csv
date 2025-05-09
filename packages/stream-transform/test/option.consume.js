import { generate } from "csv-generate";
import { transform } from "../lib/index.js";

describe("option.consume", function () {
  it("async", function (next) {
    this.timeout(0);
    let count = 0;
    const generator = generate({ length: 100000, objectMode: true });
    const transformer = generator.pipe(
      transform(
        (record, callback) => {
          count++;
          setImmediate(() => callback(null, ""));
        },
        { parallel: 7, consume: true },
      ),
    );
    transformer.on("error", next);
    transformer.on("finish", () => {
      count.should.eql(100000);
      next();
    });
  });

  it("sync", function (next) {
    this.timeout(0);
    let count = 0;
    const generator = generate({ length: 100000, objectMode: true });
    const transformer = generator.pipe(
      transform(
        (record) => {
          record;
          count++;
          return "";
        },
        { parallel: 10, consume: true },
      ),
    );
    transformer.on("error", next);
    transformer.on("end", () => {
      count.should.eql(100000);
      next();
    });
  });

  describe("sequential", function () {
    it("async", function (next) {
      this.timeout(0);
      let count = 0;
      const generator = generate({ length: 100000, objectMode: true });
      const transformer = generator.pipe(
        transform(
          (record, callback) => {
            count++;
            setImmediate(() => callback(null, ""));
          },
          { parallel: 1, consume: true },
        ),
      );
      transformer.on("finish", () => {
        count.should.eql(100000);
        next();
      });
    });

    it("sync", function (next) {
      this.timeout(0);
      let count = 0;
      const generator = generate({ length: 100000, objectMode: true });
      const transformer = generator.pipe(
        transform(
          (record) => {
            record;
            count++;
            return "";
          },
          { parallel: 1, consume: true },
        ),
      );
      transformer.on("finish", () => {
        count.should.eql(100000);
        next();
      });
    });
  });
});
