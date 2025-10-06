import { stringify } from "csv-stringify/browser/esm/sync";

window.onload = () => {
  const runEl = document.getElementById("run");
  const outputEl = document.getElementById("output");
  runEl.onclick = () => {
    const data = stringify([
      ["a", "b", "c"],
      [1, 2, 3],
    ]);
    outputEl.innerHTML = data;
  };
};
