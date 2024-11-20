// Import the package sync module
import * as csv from "csv/sync";

// Generate 20 records
const input = csv.generate({
  delimiter: "|",
  length: 20,
});
// Transform CSV data into records
const records = csv.parse(input, {
  delimiter: "|",
});
// Transform each value into uppercase
const uppercaseRecords = csv.transform(records, (record) => {
  return record.map((value) => {
    return value.toUpperCase();
  });
});
// Convert objects into a stream
const output = csv.stringify(uppercaseRecords, {
  quoted: true,
});
// Print the CSV stream to stdout
process.stdout.write(output);
