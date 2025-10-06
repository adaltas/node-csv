import fs from "fs/promises";
import { parse } from "csv-parse/sync";
import desm from "desm";

const dirname = desm(import.meta.url);

(async () => {
  const data = await fs.readFile(`${dirname}/365-utf16le-bom-windows.csv`);
  const records = parse(data, { bom: true });
  console.log("utf16le", records);
})();

(async () => {
  const data = await fs.readFile(`${dirname}/365-utf8-bom-windows.csv`);
  const records = parse(data, { bom: true });
  console.log("utf8", records);
})();
