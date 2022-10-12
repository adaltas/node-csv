
import fs from 'fs/promises'
import { parse } from 'csv-parse/sync'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async () => {
  const data = await fs.readFile(`${__dirname}/365-utf16le-bom-windows.csv`)
  const records = parse(data, {bom: true})
  console.log('utf16le', records)
})();

(async () => {
  const data = await fs.readFile(`${__dirname}/365-utf8-bom-windows.csv`)
  const records = parse(data, {bom: true})
  console.log('utf8', records)
})();
