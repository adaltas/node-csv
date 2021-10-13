
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(express.static(__dirname))
app.use('/lib', express.static(`${__dirname}/../../dist/iife`))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
