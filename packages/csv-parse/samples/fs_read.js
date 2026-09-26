import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { parse } from "csv-parse";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const parser = parse({ delimiter: ";" }, function (err, data) {
  console.info(data);
});

fs.createReadStream(__dirname + "/fs_read.csv").pipe(parser);
