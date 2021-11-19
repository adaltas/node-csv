
import * as csv from 'csv/browser/esm/index.js';

window.onload = () => {
  const runEl = document.getElementById('run');
  const outputEl = document.getElementById('output');
  runEl.onclick = (e) => {
    // Run the pipeline
    csv
    // Generate 20 records
    .generate({
      delimiter: '|',
      length: 10
    })
    // Transform CSV data into records
    .pipe(csv.parse({
      delimiter: '|'
    }))
    // Transform each value into uppercase
    .pipe(csv.transform( (record) => {
      record.push(record.shift());
      return record;
    }))
    // Convert objects into a stream
    .pipe(csv.stringify({
      quoted: true
    }))
    // Print the CSV stream to stdout
    .on('readable', function () {
      let chunck; while(chunck = this.read()){
        outputEl.innerHTML = outputEl.innerHTML + chunck.toString()
      }
    })
    .on('error', function (err) {
      outputEl.innerHTML = 'Error: ' + err.message;
    });
  };
};
