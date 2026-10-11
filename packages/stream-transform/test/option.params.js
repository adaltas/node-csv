import "should";
import { transform as transformSync } from "../lib/sync.js";
import { generate } from "csv-generate";
import { transform } from "../lib/index.js";

describe("option.params", function () {
  describe("sync API", function () {
    for (const params of [0, false, ""]) {
      it(`honors falsy params ${JSON.stringify(params)}`, function () {
        const data = transformSync(
          ["record"],
          { params },
          function (record, value) {
            return [record, value];
          },
        );
        data.should.eql([["record", params]]);
      });
    }

    for (const params of [undefined, null]) {
      it(`rejects callback handlers with params ${params}`, function () {
        (function () {
          transformSync(["record"], { params }, function (record, callback) {
            callback(null, record);
          });
        }).should.throw(
          "Invalid Handler: only synchronous handlers are supported",
        );
      });
    }
  });

  it("sync", function (next) {
    const generator = generate({ length: 100, objectMode: true, seed: 1 });
    const transformer = generator.pipe(
      transform(
        (record, params) => {
          params.my_key.should.eql("my value");
        },
        {
          parallel: 10,
          consume: true,
          params: { my_key: "my value" },
        },
      ),
    );
    transformer.on("error", next);
    transformer.on("finish", () => {
      next();
    });
  });

  it("async", function (next) {
    const generator = generate({ length: 100, objectMode: true, seed: 1 });
    const transformer = generator.pipe(
      transform(
        (record, callback, params) => {
          params.my_key.should.eql("my value");
          setImmediate(() => callback(null, ""));
        },
        {
          parallel: 10,
          consume: true,
          params: { my_key: "my value" },
        },
      ),
    );
    transformer.on("error", next);
    transformer.on("finish", () => {
      next();
    });
  });
});
