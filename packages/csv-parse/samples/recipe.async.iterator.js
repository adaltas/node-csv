import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { parse } from "csv-parse";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const processFile = async () => {
  const records = [];
  const parser = fs.createReadStream(`${__dirname}/fs_read.csv`).pipe(
    parse({
      // CSV options if any
    }),
  );
  for await (const record of parser) {
    // Work with each record
    records.push(record);
  }
  return records;
};

(async () => {
  const records = await processFile();
  console.info(records);
})();
