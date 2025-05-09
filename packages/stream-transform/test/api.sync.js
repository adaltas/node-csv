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
    }).should.throw("Invalid Handler: only synchonous handlers are supported");
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
    }).should.throw("Invalid Handler: only synchonous handlers are supported");
  });
});
