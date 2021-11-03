
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

// const parse = await import.meta.resolve('csv-parse/package.json')
// console.log(parse);

app.use(express.static(__dirname));
app.use('/lib/esm/generate/', express.static(`${__dirname}/../../packages/csv-generate/dist/esm/`));
app.use('/lib/esm/parse/', express.static(`${__dirname}/../../packages/csv-parse/dist/esm/`));
app.use('/lib/esm/transform/', express.static(`${__dirname}/../../packages/stream-transform/dist/esm/`));
app.use('/lib/esm/stringify/', express.static(`${__dirname}/../../packages/csv-stringify/dist/esm/`));
app.use('/lib/iife/generate/', express.static(`${__dirname}/../../packages/csv-generate/dist/iife/`));
app.use('/lib/iife/parse/', express.static(`${__dirname}/../../packages/csv-parse/dist/iife/`));
app.use('/lib/iife/transform/', express.static(`${__dirname}/../../packages/stream-transform/dist/iife/`));
app.use('/lib/iife/stringify/', express.static(`${__dirname}/../../packages/csv-stringify/dist/iife/`));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
