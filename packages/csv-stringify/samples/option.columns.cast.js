import assert from "node:assert/strict";
import { stringify } from "csv-stringify/sync";

const date = new Date("2026-01-02T03:04:05.000Z");
const output = stringify([{ date, datetime: date, count: 12, amount: 12 }], {
  header: true,
  columns: [
    { key: "date", cast: (value) => value.toISOString().slice(0, 10) },
    { key: "datetime", cast: (value) => value.toISOString() },
    "count",
    { key: "amount", cast: (value) => value.toFixed(2) },
  ],
});

assert.equal(
  output,
  "date,datetime,count,amount\n2026-01-02,2026-01-02T03:04:05.000Z,12,12.00\n",
);
