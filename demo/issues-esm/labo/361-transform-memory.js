import fs from "fs";
import { pipeline } from "stream/promises";
import { transform } from "stream-transform";
import desm from 'desm';
const dirname = desm(import.meta.url);

const format = (data) =>
  `${Math.round((data / 1024 / 1024) * 100) / 100} MB`;
let maxUsedHeap = 0;
async function main() {
  setInterval(() => {
    const stats = process.memoryUsage();
    maxUsedHeap = Math.max(maxUsedHeap, stats.heapUsed);
    console.log(`head used: ${format(stats.heapUsed)}; max heap used: ${format(maxUsedHeap)}`)
  }, 1000);

  await pipeline(
    function* () {
      let i = -1;
      // Original code with a record limit
      // const n = 9999999;
      // while (++i < n) {
      //   yield { i };
      // }
      // Run with unlimited records
      while (true) {
        i++
        yield { i };
      }
    },
    transform({ parallel: +process.env.PARALLEL }, (chunk, next) =>
      next(null, chunk.i)
    ),
    fs.createWriteStream(`${dirname}/361-transform-memory.csv`)
  );

  console.log(`${maxUsedHeap / (1000 * 1000)}mb`);
}

main();

// $ PARALLEL=1 node example.js
// 6.009856mb

// $ PARALLEL=2 node example.js
// 320.684144mb
