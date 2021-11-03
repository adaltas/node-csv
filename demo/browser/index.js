
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

// const parse = await import.meta.resolve('csv-parse/package.json')
// console.log(parse);

app.use(express.static(__dirname))
app.use('/lib/parse/', express.static(`${__dirname}/../../packages/csv-parse/dist/iife/`))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
