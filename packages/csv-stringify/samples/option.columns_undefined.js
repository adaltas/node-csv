import { stringify } from "csv-stringify";
import assert from "node:assert";

stringify(
  [
    { year: "XXXX", phone: "XXX XXXX", nocolumn: "XXX" },
    { year: "YYYY", phone: "YYY YYYY", nocolumn: "XXX" },
  ],
  {
    columns: ["phone", "year", "nofield"],
  },
  function (err, data) {
    assert.equal(data, "XXX XXXX,XXXX,\n" + "YYY YYYY,YYYY,\n");
  },
);
