import { Writable } from "node:stream";
import { pipeline } from "stream/promises";
import { generate } from "csv-generate";
import { transform } from "stream-transform";

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
  // Write delay, `0` to write instantly
  write_delay: 1000,
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

// Iterate over an unlimited records
const iterate = function* () {
  let i = -1;
  // Run with
  while (true) {
    i++;
    yield { i };
  }
};

// Consome the records instantly or with delay
const consume = new Writable({
  write: function (_, __, callback) {
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

await pipeline(
  // Step 1 - generate
  config.iterate
    ? iterate()
    : generate({
        columns: 10,
        objectMode: config.objectMode,
        length: config.length,
        highWaterMark: config.highWaterMark,
      }),
  // Step 2 - transform
  transform({ parallel: config.parallel, highWaterMark: 1 }, function (chunk) {
    // Sync
    // return JSON.stringify(chunk) + "\n"
    // Async
    return new Promise((resolve) => {
      resolve(JSON.stringify(chunk) + "\n");
    });
  }),
  // Step 3 - consume
  consume,
);
