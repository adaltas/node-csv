import { stringify } from "csv-stringify";
import assert from "node:assert";

stringify(
  [{ a: "1", b: "2" }],
  {
    header: true,
    header_as_comment: "//",
  },
  function (err, data) {
    assert.equal(data, "// a,b\n1,2\n");
  },
);
