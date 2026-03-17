const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");

const dir = path.resolve(__dirname, "../lib");
const samples = fs.readdirSync(dir);

describe("Samples", function () {
  /* eslint mocha/no-setup-in-describe: "off" */
  samples
    .filter((sample) => {
      if (!/\.(js|ts)?$/.test(sample)) return false;
      return true;
    })
    .map((sample) => {
      it(`Sample ${sample}`, async function () {
        const data = fs.readFileSync(path.resolve(dir, sample), "utf8");
        if (/^["|']skip test["|']/.test(data)) return;
        return new Promise((resolve, reject) => {
          const ext = /\.(\w+)?$/.exec(sample)[0];
          let cmd, args;
          switch (ext) {
            case ".js":
              [cmd, ...args] = ["node", path.resolve(dir, sample)];
              break;
            case ".ts":
              [cmd, ...args] = ["ts-node", path.resolve(dir, sample)];
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
