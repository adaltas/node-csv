const fs = require("fs");
const { parse: parseCsv } = require("csv-parse");

async function main() {
  const parser1 = fs.createReadStream(__dirname + "/399.csv").pipe(parseCsv());
  const parser2 = fs
    .createReadStream(__dirname + "/399.csv")
    .pipe(parseCsv({ relax_quotes: true, from_line: 2 }));
  setImmediate(async () => {
    for await (const record of parser1) {
      console.log(record);
    }
  });
  setImmediate(async () => {
    for await (const record of parser2) {
      console.log(record);
    }
  });
}
main();
