
import * as csv from 'csv/browser/esm/sync';

window.onload = () => {
  const runEl = document.getElementById('run');
  const outputEl = document.getElementById('output');
  runEl.onclick = (e) => {
    try{
      // Run the pipeline
      const input = csv.generate({
        delimiter: '|',
        length: 10
      });
      const rawRecords = csv.parse(input, {
        delimiter: '|'
      });
      const refinedRecords = csv.transform(rawRecords, (record) => {
        record.push(record.shift());
        return record;
      });
      const output = csv.stringify(refinedRecords, {
        quoted: true
      });
      outputEl.innerHTML = output;
    }catch(err){
      outputEl.innerHTML = 'Error: ' + err.message;
    }
  };
};
