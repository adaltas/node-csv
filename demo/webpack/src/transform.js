
import {transform} from 'stream-transform/browser/esm/index.js';

window.onload = () => {
  const runEl = document.getElementById('run');
  const outputEl = document.getElementById('output');
  runEl.onclick = (e) => {
    transform([
      ['a', 'b', 'c'],
      [1, 2, 3]
    ], (record) => {
      record.push(record.shift());
      return record;
    }, (err, records) => {
      outputEl.innerHTML = JSON.stringify(records, null, 2);
    });
  };
};
