import { stringify } from "csv-stringify/browser/esm";

window.onload = () => {
  const runEl = document.getElementById("run");
  const outputEl = document.getElementById("output");
  runEl.onclick = () => {
    stringify(
      [
        ["a", "b", "c"],
        [1, 2, 3],
      ],
      (err, data) => {
        outputEl.innerHTML = data;
      },
    );
  };
};
