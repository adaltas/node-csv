import { readFile, readdir, writeFile } from "node:fs/promises";

const cjsDirectory = new URL("../dist/cjs/", import.meta.url);
for (const entry of await readdir(cjsDirectory)) {
  if (!entry.endsWith(".d.cts")) continue;
  const declaration = new URL(entry, cjsDirectory);
  const source = await readFile(declaration, "utf8");
  await writeFile(declaration, source.replace(/\.js(["'])/g, ".cjs$1"));
}

const browserDeclaration = new URL("../dist/esm/index.d.ts", import.meta.url);
const nodeReference = '/// <reference types="node" />\n\n';
const source = await readFile(browserDeclaration, "utf8");
if (!source.startsWith(nodeReference)) {
  throw new Error("Expected the Node type reference in the source declaration");
}
await writeFile(browserDeclaration, source.slice(nodeReference.length));
