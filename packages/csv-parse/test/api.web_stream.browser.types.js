import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";

const require = createRequire(import.meta.url);

describe("API browser Web Stream types", function () {
  it("works with DOM types without introducing Node globals", function () {
    const dir = mkdtempSync(join(tmpdir(), "csv-parse-browser-types-"));
    try {
      const pkg = join(dir, "node_modules", "csv-parse");
      mkdirSync(pkg, { recursive: true });
      cpSync(new URL("../dist", import.meta.url), join(pkg, "dist"), {
        recursive: true,
      });
      cpSync(
        new URL("../package.json", import.meta.url),
        join(pkg, "package.json"),
      );
      writeFileSync(join(dir, "package.json"), '{"type":"module"}');
      writeFileSync(
        join(dir, "tsconfig.json"),
        JSON.stringify({
          compilerOptions: {
            noEmit: true,
            strict: true,
            types: [],
            lib: ["ES2022", "DOM", "DOM.Iterable"],
            module: "NodeNext",
            moduleResolution: "NodeNext",
            target: "ES2022",
          },
          files: ["browser.ts"],
        }),
      );
      writeFileSync(
        join(dir, "browser.ts"),
        `import { parse, normalize_options, CsvError, type Options } from 'csv-parse/browser/esm/stream';
const options: Options = { bom: true, columns: true, delimiter: '|@|' };
const stream: TransformStream<Uint8Array, unknown> = parse(options);
const timer: number = setTimeout(() => {}, 0);
const delimiter: Uint8Array[] = normalize_options(options).delimiter;
new CsvError('CSV_QUOTE_NOT_CLOSED', 'test');
stream.writable.getWriter().write(new TextEncoder().encode('a,b\\n'));
// @ts-expect-error Unsupported parser option.
parse({ absentOption: true });
// @ts-expect-error Browser imports must not inject Node's Buffer global.
Buffer.from('x');
// @ts-expect-error Browser imports must not inject Node's process global.
process.version;
void [timer, delimiter];`,
      );
      assert.doesNotThrow(() =>
        execFileSync(
          process.execPath,
          [require.resolve("typescript/bin/tsc"), "-p", dir],
          {
            encoding: "utf8",
          },
        ),
      );
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
