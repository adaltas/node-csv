import { parse } from "csv-parse/browser/esm/sync";

window.onload = () => {
  const runEl = document.getElementById("run");
  const outputEl = document.getElementById("output");
  runEl.onclick = () => {
    const records = parse("a,b,c\n1,2,3");
    outputEl.innerHTML = JSON.stringify(records, null, 2);
  };
};
