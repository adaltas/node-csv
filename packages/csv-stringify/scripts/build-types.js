import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";

const lib = new URL("../lib/", import.meta.url);
const cjs = new URL("../dist/cjs/", import.meta.url);
const esm = new URL("../dist/esm/", import.meta.url);
const index = (await readFile(new URL("index.d.ts", lib), "utf8")).replaceAll(
  "\r\n",
  "\n",
);
const sync = (await readFile(new URL("sync.d.ts", lib), "utf8")).replaceAll(
  "\r\n",
  "\n",
);
const nodeHeader =
  '/// <reference types="node" />\n\nimport * as stream from "stream";';

if (!index.startsWith(nodeHeader)) {
  throw new Error("Update the browser declaration header for lib/index.d.ts");
}

const browserHeader =
  'import type * as stream from "./browser.js";\nimport type { Buffer } from "./browser.js";';

await mkdir(cjs, { recursive: true });
await mkdir(esm, { recursive: true });
await writeFile(new URL("index.d.cts", cjs), index);
await writeFile(
  new URL("sync.d.cts", cjs),
  sync.replaceAll("./index.js", "./index.cjs"),
);
await writeFile(
  new URL("index.d.ts", esm),
  browserHeader + index.slice(nodeHeader.length),
);
await writeFile(new URL("sync.d.ts", esm), sync);
await copyFile(new URL("browser.d.ts", lib), new URL("browser.d.ts", esm));
