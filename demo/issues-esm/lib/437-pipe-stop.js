"skip test";
// Issue #437
// Steady memory use increase when processing not so large files

import { Writable, Transform } from "node:stream";
import { pipeline } from "stream/promises";
import { generate } from "csv-generate";
import { parse } from "csv-parse";
import { stringify } from "csv-stringify";

// Configuration
const config = {
  // Use `true`for a simple iterator or `false` to use csv generate
  iterate: true,
  // Generation window size, 1 for one record per `StreamReader._read` call
  // Default is `objectMode ? 16 : 16384`
  highWaterMark: 1,
  // Number of records to generate, `-1` for infinite
  length: -1,
  // Number of parallel handler execution, `100` by default
  parallel: 100,
  // Generate object or strings, both are supported
  objectMode: false,
  // Use a write delay comprised between 0 and the `config.write_delay` value
  random_delay: true,
  // Write delay in millisecond, `0` to write instantly
  write_delay: 10,
};

// Internal counter
let count = 0;

// Memory information
const formatMemoryUsage = (data) =>
  `${Math.round((data / 1024 / 1024) * 100) / 100} MB`;
const interval = setInterval(() => {
  const memoryData = process.memoryUsage();
  const memoryUsage = {
    rss: `${formatMemoryUsage(
      memoryData.rss,
    )} -> Resident Set Size - total memory allocated for the process execution`,
    heapTotal: `${formatMemoryUsage(
      memoryData.heapTotal,
    )} -> total size of the allocated heap`,
    heapUsed: `${formatMemoryUsage(
      memoryData.heapUsed,
    )} -> actual memory used during the execution`,
    external: `${formatMemoryUsage(memoryData.external)} -> V8 external memory`,
  };
  console.log(`${count} records, usage:`, memoryUsage);
  if (config.length !== -1 && count >= config.length) {
    clearInterval(interval);
  }
}, 1000);

// Consome the records instantly or with delay
const consume = new Writable({
  write: function (chunk, __, callback) {
    if (config.write_delay === 0) {
      count++;
      callback();
    } else {
      setTimeout(
        () => {
          count++;
          callback();
        },
        config.random_delay
          ? Math.random() * config.write_delay
          : config.write_delay,
      );
    }
  },
});

const control = new Transform({
  objectMode: true,
  transform: function (chunk, encoding, callback) {
    if (count > 1000) {
      this.end(chunk);
      clearInterval(interval);
      return;
    }
    callback(null, chunk);
  },
});

await pipeline(
  // Step 1 - generate
  generate({
    columns: 10,
    objectMode: config.objectMode,
    length: config.length,
    highWaterMark: config.highWaterMark,
  }),
  // Step 2 - parse CSV input
  parse(),
  // Step 3 - stop the pipeline
  control,
  // Step 4 - stringify records
  stringify(),
  // Step 5 - consume
  consume,
);
