import "should";
import stream from "stream";
import { generate } from "csv-generate";
import { transform } from "../lib/index.js";

describe("api.pipe", function () {
  describe("source", function () {
    it("in sync mode", function (next) {
      const data = [];
      const generator = generate({
        length: 1000,
        objectMode: true,
        seed: 1,
        columns: 2,
      });
      const transformer = generator.pipe(
        transform(function (record) {
          record.push(record.shift());
          return record;
        }),
      );
      transformer.on("readable", function () {
        let d;
        while ((d = transformer.read())) {
          data.push(d);
        }
      });
      transformer.on("end", function () {
        data.length.should.eql(1000);
        data.slice(0, 2).should.eql([
          ["ONKCHhJmjadoA", "OMH"],
          ["GeACHiN", "D"],
        ]);
        next();
      });
    });

    it("in async mode", function (next) {
      const data = [];
      const generator = generate({
        length: 1000,
        objectMode: true,
        seed: 1,
        columns: 2,
      });
      const transformer = generator.pipe(
        transform(function (record, callback) {
          record.push(record.shift());
          callback(null, record);
        }),
      );
      transformer.on("readable", function () {
        let d;
        while ((d = transformer.read())) {
          data.push(d);
        }
      });
      transformer.on("end", function () {
        data.slice(0, 2).should.eql([
          ["ONKCHhJmjadoA", "OMH"],
          ["GeACHiN", "D"],
        ]);
        next();
      });
    });
  });

  describe("source and destination", function () {
    it("in sync mode", function (next) {
      this.timeout(0);
      const generator = generate({
        length: 10000,
        objectMode: true,
        seed: 1,
        columns: 2,
      });
      const destination = new stream.Writable();
      destination._write = function (chunk, encoding, callback) {
        setImmediate(callback);
      };
      destination.on("finish", next);
      generator
        .pipe(
          transform(function (record) {
            return record.join(",");
          }),
        )
        .pipe(destination);
    });

    it("in async mode", function (next) {
      this.timeout(0);
      const generator = generate({
        length: 10000,
        objectMode: true,
        seed: 1,
        columns: 2,
      });
      const destination = new stream.Writable();
      destination._write = function (chunk, encoding, callback) {
        setImmediate(callback);
      };
      destination.on("finish", next);
      generator
        .pipe(
          transform(function (record, callback) {
            setImmediate(function () {
              callback(null, record.join(","));
            });
          }),
        )
        .pipe(destination);
    });
  });
});
