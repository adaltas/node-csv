import fs from "node:fs";
import assert from "node:assert";
import { finished } from "node:stream/promises";
import { parse, transform, stringify } from "csv";

const __dirname = new URL(".", import.meta.url).pathname;
await fs.promises.writeFile(
  `${__dirname}/example.fs.input.csv`,
  "a,b,c\n1,2,3",
);

await finished(
  fs
    .createReadStream(`${__dirname}/example.fs.input.csv`)
    .pipe(parse())
    .pipe(transform((record) => record.reverse()))
    .pipe(stringify())
    .pipe(fs.createWriteStream(`${__dirname}/example.fs.output.csv`)),
);

assert.equal(
  await fs.promises.readFile(`${__dirname}/example.fs.output.csv`, "utf8"),
  "c,b,a\n3,2,1\n",
);
