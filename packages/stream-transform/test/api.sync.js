import "should";
import { transform } from "../lib/sync.js";

describe("api.sync", function () {
  it("accept data and handler without options", function () {
    const data = transform(
      [
        ["a", "b", "c"],
        ["1", "2", "3"],
      ],
      function (record) {
        return record.join("|");
      },
    );
    data.should.eql(["a|b|c", "1|2|3"]);
  });

  it("honors params option", function () {
    const data = transform(
      [
        ["a", "b", "c"],
        ["1", "2", "3"],
      ],
      {
        params: { separator: "|" },
      },
      function (record, params) {
        return record.join(params.separator);
      },
    );
    data.should.eql(["a|b|c", "1|2|3"]);
  });

  for (const params of [0, false, ""]) {
    it(`honors falsy params ${JSON.stringify(params)}`, function () {
      const data = transform(["record"], { params }, function (record, value) {
        return [record, value];
      });
      data.should.eql([["record", params]]);
    });
  }

  for (const params of [undefined, null]) {
    it(`rejects callback handlers with params ${params}`, function () {
      (function () {
        transform(["record"], { params }, function (record, callback) {
          callback(null, record);
        });
      }).should.throw(
        "Invalid Handler: only synchronous handlers are supported",
      );
    });
  }

  it("only sync handlers are supported", function () {
    // Without options
    (function () {
      transform(
        [
          ["a", "b", "c"],
          ["1", "2", "3"],
        ],
        function (record, callback) {
          record;
          callback;
        },
      );
    }).should.throw("Invalid Handler: only synchronous handlers are supported");
    // With options
    (function () {
      transform(
        [
          ["a", "b", "c"],
          ["1", "2", "3"],
        ],
        {
          params: { a_key: "a value" },
        },
        function (record, callback, params) {
          record;
          callback;
          params;
        },
      );
    }).should.throw("Invalid Handler: only synchronous handlers are supported");
  });
});
