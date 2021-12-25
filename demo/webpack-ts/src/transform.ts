
import {transform} from 'stream-transform/browser/esm';

window.onload = () => {
  const runEl = document.getElementById('run');
  const outputEl = document.getElementById('output');
  if(!runEl || !outputEl) return;
  runEl.onclick = () => {
    transform([
      ['a', 'b', 'c'],
      [1, 2, 3]
    ], (record: string[] | number[]) => {
      const el = record.shift();
      // `never` is awkward to me, without it, we got the following error:
      // TS2345: Argument of type 'string | number' is not assignable to parameter of type 'never'.
      // solution is mentionned here https://stackoverflow.com/questions/52423842/what-is-not-assignable-to-parameter-of-type-never-error-in-typescript
      if(el !== undefined) record.push(el as never);
      return record;
    }, (err, records) => {
      outputEl.innerHTML = JSON.stringify(records, null, 2);
    });
  };
};
