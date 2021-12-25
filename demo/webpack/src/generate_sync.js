
import {generate} from 'csv-generate/browser/esm/sync';

window.onload = () => {
  const runEl = document.getElementById('run');
  const outputEl = document.getElementById('output');
  runEl.onclick = (e) => {
    const records = generate({
      objectMode: true,
      length: 2
    });
    outputEl.innerHTML = JSON.stringify(records, null, 2);
  };
};
