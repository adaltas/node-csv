import { generate } from "csv-generate/browser/esm";

window.onload = () => {
  const runEl = document.getElementById("run");
  const outputEl = document.getElementById("output");
  runEl.onclick = () => {
    generate(
      {
        objectMode: true,
        length: 2,
      },
      (err, records) => {
        outputEl.innerHTML = JSON.stringify(records, null, 2);
      },
    );
  };
};
