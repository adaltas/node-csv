import { parse } from "csv-parse/browser/esm";

window.onload = () => {
  const runEl = document.getElementById("run");
  const outputEl = document.getElementById("output");
  runEl.onclick = () => {
    parse("a,b,c\n1,2,3", (err, records) => {
      outputEl.innerHTML = JSON.stringify(records, null, 2);
    });
  };
};
