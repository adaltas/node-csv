import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

const __dirname = new URL(".", import.meta.url).pathname;
const dir = path.resolve(__dirname, "../samples");
const samples = await fs.readdir(dir);

const [, major] = process.version.match(/(\d+)\.\d+\.\d+/);

describe("Samples", function () {
  /* eslint mocha/no-setup-in-describe: "off" */
  samples
    .filter((sample) => !(major < 16 && sample === "recipe.promises.js"))
    .filter((sample) => {
      if (!/\.(js|ts)?$/.test(sample)) return false;
      return true;
    })
    .map((sample) => {
      it(`Sample ${sample}`, async function () {
        const data = await fs.readFile(path.resolve(dir, sample), "utf8");
        if (/^["|']skip test["|']/.test(data)) return;
        return new Promise((resolve, reject) => {
          const ext = /\.(\w+)?$/.exec(sample)[0];
          let cmd, args;
          switch (ext) {
            case ".js":
              [cmd, ...args] = ["node", path.resolve(dir, sample)];
              break;
            case ".ts":
              [cmd, ...args] = [
                "node",
                "--loader",
                "ts-node/esm",
                path.resolve(dir, sample),
              ];
              break;
          }
          spawn(cmd, args)
            .on("close", (code) =>
              code === 0 ? resolve() : reject(new Error("Failure")),
            )
            .stdout.on("data", () => {});
        });
      });
    });
});
