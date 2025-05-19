import { parse, CsvError } from "csv-parse/browser/esm";

window.onload = () => {
  const runEl = document.getElementById("run");
  const outputEl = document.getElementById("output");
  if (!runEl || !outputEl) return;
  runEl.onclick = () => {
    parse("a,b,c\n1,2,3", (err: CsvError | undefined, records: any) => {
      outputEl.innerHTML = JSON.stringify(records, null, 2);
    });
  };
};
