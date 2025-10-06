import { parse } from "csv-parse/sync";
import assert from "assert";

assert.deepEqual(
  parse("a,b,c\n1,2,3\n4,5,6", {
    cast: (value, context) => {
      if (context.header) return value;
      console.log("cast: " + context.column);
      if (context.column === "B") return Number(value);
      return String(value);
    },
    columns: (header) => {
      console.log("columns: " + header.toString());
      return header.map((label) => {
        return label.toUpperCase();
      });
    },
    trim: true,
  }),
  [
    { A: "1", B: 2, C: "3" },
    { A: "4", B: 5, C: "6" },
  ],
);
