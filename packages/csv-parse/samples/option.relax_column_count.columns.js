import assert from "node:assert";
import dedent from "dedent";
import { parse } from "csv-parse";

parse(
  dedent`
    lastname,firstname,fullname
    Ritchie
    Lovelace,Ada,"Augusta Ada King, Countess of Lovelace"
  `,
  {
    relax_column_count: true,
    columns: true,
  },
  function (err, records) {
    assert.deepStrictEqual(records, [
      { lastname: "Ritchie" },
      {
        lastname: "Lovelace",
        firstname: "Ada",
        fullname: "Augusta Ada King, Countess of Lovelace",
      },
    ]);
  },
);
