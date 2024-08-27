import stream from "node:stream";
import { generate } from "csv-generate";
import { parse } from "csv-parse";
import { stringify } from "csv-stringify";

let count = 0;
// Memory information
const formatMemoryUsage = (data) =>
  `${Math.round((data / 1024 / 1024) * 100) / 100} MB`;
setInterval(() => {
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
}, 1000);

async function entryPoint() {
  const sourceFilename = "test_10k.zip";
  const startIndex = 1;
  const outputDelimiter = ";";
  const fieldCount = 10;
  const outputColumns = [
    { key: "Id" },
    { key: "Address" },
    { key: "Target" },
    ...Array.from({ length: fieldCount }, (_, x) => ({ key: `Field${x + 1}` })),
    { key: "Message" },
  ];
  // parse the first file in the archive
  const parser = generate({
    delimiter: ";",
    columns: 3,
  }).pipe(
    parse({
      delimiter: ";",
      columns: ["Id", "Address", "Target"],
      from: startIndex,
    }),
  );
  const stringifier = stringify({
    header: true,
    delimiter: outputDelimiter,
    columns: outputColumns,
    cast: {
      boolean: function (value) {
        return "" + value;
      },
    },
  });

  // setup the output, originally s3 Upload (AWS SDK v3) but replaced by noop-stream in test
  const outputStream = await stream.Writable({
    write: (_, __, callback) => callback(),
  });
  stringifier.pipe(outputStream);
  // process every record
  let recordIndex = 0;
  let errors = [];
  for await (const record of parser) {
    count++;
    if (
      !validateRecord(
        record,
        recordIndex,
        ["Id", "Address", "Target"],
        sourceFilename,
        errors,
      )
    )
      throw new Error(errors.join(";"));
    const restResults = await queryRestApi(record);
    const outputRecord = processResults(restResults, fieldCount);
    stringifier.write(outputRecord);
    recordIndex++;
  }
  stringifier.end();
  console.log("==> output ended, " + errors.length + " errors");
  //await upload.done();
  console.log("==> content file written");
}

function validateRecord(record, recordIndex, expectedFields, filePath, errors) {
  if (recordIndex > 1) return true;
  const recordKeys = Object.keys(record);
  let errorCount = 0;
  for (const expectedField of expectedFields) {
    if (!recordKeys.includes(expectedField)) {
      errors.push(
        `[${expectedField}] is missing in ${filePath}, existing fields are: [${recordKeys.join("],[")}]`,
      );
      errorCount++;
    }
  }

  return errorCount == 0;
}

const sleep = function (ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

async function queryRestApi(record) {
  await sleep(10);
  const restResults = {
    Id: record.Id,
    Address: record.Address,
    Target: record.target,
    Field1: "a",
    Message: "",
  };
  return restResults;
}

function processResults(restResults, fieldCount) {
  const resultRecord = restResults;
  resultRecord.Field1 = restResults.Field1.repeat(25);
  for (const index of Array.from({ length: fieldCount - 1 }, (_, x) => x + 2))
    resultRecord[`Field${index}`] = "b".repeat(25);

  return resultRecord;
}

console.log("starting...");
entryPoint()
  .then(console.log("done"))
  .catch((err) => console.log(err));
