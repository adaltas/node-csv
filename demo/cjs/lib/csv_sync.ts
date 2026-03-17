// Import the package sync module
// Node.js >= 14
import * as csv from "csv/sync";
// Node.js < 14
// import * as csv from 'csv/dist/cjs/sync';

// Generate 20 records
const input: string = csv.generate({
  delimiter: "|",
  length: 20,
});
// Transform CSV data into records
const records: string[][] = csv.parse(input, {
  delimiter: "|",
});
// Transform each value into uppercase
const uppercaseRecords: string[][] = csv.transform(
  records,
  (record: string[]) => {
    return record.map((value: string) => {
      return value.toUpperCase();
    });
  },
);
// Convert objects into a stream
const output: string = csv.stringify(uppercaseRecords, {
  cast: {
    string: (value: string, context: csv.stringifier.CastingContext) => {
      return context.index % 2 ? value.toLowerCase() : value.toUpperCase();
    },
  },
  quoted: true,
});
// Print the CSV stream to stdout
process.stdout.write(output);
