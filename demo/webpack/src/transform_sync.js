import { transform } from "stream-transform/browser/esm/sync";

window.onload = () => {
  const runEl = document.getElementById("run");
  const outputEl = document.getElementById("output");
  runEl.onclick = () => {
    const records = transform(
      [
        ["a", "b", "c"],
        [1, 2, 3],
      ],
      (record) => {
        record.push(record.shift());
        return record;
      },
    );
    outputEl.innerHTML = JSON.stringify(records, null, 2);
  };
};
