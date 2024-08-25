import assert from "node:assert";
import util from "node:util";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import stream from "node:stream";
import pad from "pad";
import { parse } from "csv-parse";
import { generate } from "csv-generate";
const finished = util.promisify(stream.finished);
const NS_PER_SEC = 1e9;

const write = async function (length, target) {
  const writter = generate({
    length: length,
  }).pipe(
    fs.createWriteStream(target, {
      highWaterMark: 64 * 64 * 1024,
    })
  );
  await finished(writter);
};

const read = async function (length, source) {
  let count = 0;
  const parser = fs
    .createReadStream(source, {
      highWaterMark: 64 * 64 * 1024,
    })
    .pipe(parse());
  for await (const record of parser) {
    record;
    count++;
  }
  assert.strictEqual(count, length);
};

const dispose = async function (source) {
  await fs.promises.unlink(source);
};

const reporter = function () {
  const data = [];
  return function (...info) {
    if (info.length) {
      data.push(info);
    } else {
      return data;
    }
  };
};

const print = function (results) {
  console.log("");
  console.log(
    [
      "|",
      [
        pad(" length ", 10 + 2),
        pad(" nanoseconds ", 15 + 2),
        pad(" throughput ", 15 + 2),
      ].join("|"),
      "|",
    ].join("")
  );
  console.log(
    ["|", ["-".repeat(12), "-".repeat(17), "-".repeat(17)].join("|"), "|"].join(
      ""
    )
  );
  results.forEach(([length, nanoseconds, throughput]) => {
    console.log(
      [
        "|",
        [
          ` ${pad(`${length}`, 10)} `,
          ` ${pad(`${nanoseconds}`, 15)} `,
          ` ${pad(`${throughput}`, 15)} `,
        ].join("|"),
        "|",
      ].join("")
    );
  });
  console.log("");
};

const main = async function () {
  const tests = [20000, 200000, 2000000, 20000000, 200000000].map((length) => ({
    length: length,
    target: path.join(os.tmpdir(), `data-${length}.csv`),
  }));
  const report = reporter();
  await Promise.all(
    tests.map(async function ({ length, target }) {
      const time = process.hrtime();
      await write(length, target);
      const [seconds] = process.hrtime(time);
      console.log(`File ${target} created in ${seconds} seconds`);
    })
  );
  await Promise.all(
    await tests.map(async function ({ length, target }) {
      const hrtime = process.hrtime();
      await read(length, target);
      const [seconds, hrtime_nanoseconds] = process.hrtime(hrtime);
      const nanoseconds = seconds * NS_PER_SEC + hrtime_nanoseconds;
      const throughput = Math.round((length / nanoseconds) * NS_PER_SEC);
      console.log(
        "Benchmark time:",
        `${nanoseconds} nanoseconds (${seconds} seconds)`
      );
      console.log(
        "Benchmark throughput:",
        Math.round(throughput),
        "records per second"
      );
      report(length, nanoseconds, throughput);
    })
  );
  await Promise.all(
    await tests.map(async function ({ target }) {
      await dispose(target);
    })
  );
  const results = report();
  print(results);
};

main();

/*

| length     | nanoseconds     | throughput      |
|------------|-----------------|-----------------|
| 20000      | 983243192       | 20341           |
| 200000     | 3427937159      | 58344           |
| 2000000    | 23679366525     | 84462           |
| 20000000   | 178759143881    | 111882          |
| 200000000  | 979745580322    | 204135          |

*/
