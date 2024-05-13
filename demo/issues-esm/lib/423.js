'skip test'

import fs from "node:fs";
import os from "node:os";
import dedent from "dedent";
import { Writable } from "node:stream";
// import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { parse } from "csv-parse";
import { stringify } from "csv-stringify";
import { exec as _exec } from "node:child_process";
import util from "node:util";
const exec = util.promisify(_exec);

const dir = os.tmpdir()

const {stdout, stderr} = await exec(dedent`
  [ -f ${dir}/csv-423/allCountries.txt ] && exit 0
  mkdir -p ${dir}/csv-423
  cd ${dir}/csv-423
  curl https://download.geonames.org/export/dump/allCountries.zip -O
  unzip allCountries.zip
  ls -l
`)

await pipeline(
  fs.createReadStream(`${dir}/csv-423/allCountries.txt`),
  parse({
    bom: true,
    cast: true,
    columns: false,
    comment: "#",
    comment_no_infix: true,
    delimiter: "\t",
    escape: null,
    groupColumnsByName: false,
    quote: null,
    record_delimiter: ["\n", "\r", "\r\n"],
    relax_quotes: true,
    skip_empty_lines: true,
  }),
  stringify({ delimiter: "|" }),
  // process.stdout
  new Writable ({write: (chunk, encoding, callback) => callback()})
);
