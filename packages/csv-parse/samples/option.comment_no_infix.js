import assert from "node:assert";
import dedent from "dedent";
import { parse } from "csv-parse/sync";

const output = parse(
  dedent`
    # Illustrate the usage of comment_no_infix
    a,b#,c
  `,
  {
    comment: "#",
    comment_no_infix: true,
  },
);

assert.deepStrictEqual(output, [["a", "b#", "c"]]);
