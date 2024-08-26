import { stringify } from "csv-stringify";
import { generate } from "csv-generate";

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
    }),
  )
  .pipe(process.stdout);
