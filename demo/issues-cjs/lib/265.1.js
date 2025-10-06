const { parse } = require("csv-parse");
const fs = require("fs");

fs.createReadStream(`${__dirname}/265.tubs.csv`)
  .pipe(
    parse({
      delimiter: ",",
      columns: false,
      skip_empty_lines: true,
      trim: true,
    }),
  )
  .on("data", (data) => {
    console.log(data);
  });
