import "should";
import { transform, Options, Transformer } from "../lib/index.js";

describe("api.types", function () {
  describe("Initialisation", function () {
    it("stream", async function () {
      // With handler
      const transformer: Transformer = transform((record) => record);
      transformer.should.be.an.Object();
      // With handler + callback
      transform(
        (record) => record,
        (err, records) => err || records,
      );
      // With records + handler
      transform(["record"], (record) => record);
      // With options + handler
      transform({ consume: true }, (record) => record);
      // With records + options + handler
      transform(["record"], { consume: true }, (record) => record);
      // With records + options + handler + callback
      transform(
        ["record"],
        { consume: true },
        (record) => record,
        (err, records) => err || records,
      );
    });

    it("handler before options", async function () {
      const transformer = transform((record: string) => record.toUpperCase(), {
        parallel: 1,
      });
      transformer.end("hello");
      const records = [];
      for await (const record of transformer) {
        records.push(record);
      }
      records.should.eql(["HELLO"]);
      transformer.options.should.have.property("parallel", 1);
    });

    it("records and handler before options with callback", function (done) {
      transform(
        ["hello", "world"],
        (record) => record.toUpperCase(),
        { parallel: 1 },
        (err, records) => {
          if (err) return done(err);
          records!.should.eql(["HELLO", "WORLD"]);
          done();
        },
      );
    });
  });

  describe("Parser", function () {
    it("Expose options", function () {
      const transformer: Transformer = transform((record) => record);
      const options: Options = transformer.options;
      const keys = Object.keys(options);
      keys.sort().should.eql(["consume", "objectMode", "parallel", "params"]);
    });
  });

  describe("Options", function () {
    it("consume", function () {
      const options: Options = {};
      options.consume = true;
    });

    it("parallel", function () {
      const options: Options = {};
      options.parallel = 100;
    });

    it("params", function () {
      const options: Options = {};
      options.params = { my_key: "my value" };
    });
  });

  describe("State", function () {
    it("finished", function () {
      const transformer: Transformer = transform((record) => record);
      const finished: number = transformer.state.finished;
      finished.should.eql(0);
    });

    it("running", function () {
      const transformer: Transformer = transform((record) => record);
      const running: number = transformer.state.running;
      running.should.eql(0);
    });

    it("started", function () {
      const transformer: Transformer = transform((record) => record);
      const started: number = transformer.state.started;
      started.should.eql(0);
    });
  });
});
