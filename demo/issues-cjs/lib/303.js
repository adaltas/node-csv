const { parse } = require("csv-parse");
const fs = require("fs");

fs.createReadStream(`${__dirname}/303.csv`)
  .pipe(parse())
  .on("data", (data) => {
    console.log(data);
  });
// fs.createReadStream('./303.csv').pipe(parse())
// .on('readable', function(){
//   let record;while ((record = this.read()) !== null) {
//     // console.log(record);
//   }
// });
