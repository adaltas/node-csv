import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

mkdirSync("dist/esm/browser/api", { recursive: true });
writeFileSync(
  "dist/esm/browser/stream.d.ts",
  readFileSync("lib/browser/stream.d.ts", "utf8").replaceAll('"../', '"./'),
);
copyFileSync("lib/browser/buffer.d.ts", "dist/esm/browser/buffer.d.ts");
copyFileSync("lib/api/CsvError.d.ts", "dist/esm/browser/api/CsvError.d.ts");
// Reuse the parser options without introducing Node ambient types in DOM apps.
writeFileSync(
  "dist/esm/browser/options.d.ts",
  'import type { Buffer, BufferEncoding } from "./buffer.js";\n' +
    readFileSync("lib/options.d.ts", "utf8"),
);
