import fs from "fs";
import { stringify } from "csv-stringify";
import { generate } from "csv-generate";

// Write stream initialisation
const ws = fs.createWriteStream("/tmp/a_test");
// Write some metadata
ws.write("---\n");
ws.write("propery: My Value\n");
ws.write("---\n");

generate({
  length: 20,
  objectMode: true,
  seed: 1,
  headers: 2,
  duration: 400,
})
  .pipe(
    stringify({
      header: true,
      columns: {
        year: "birthYear",
        phone: "phone",
      },
    })
  )
  .pipe(ws);
