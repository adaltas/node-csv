// Import the package sync module
import * as csv from "csv/sync";

// Generate 20 records
const input: string = csv.generate({
  delimiter: "|",
  length: 20,
});
// Transform CSV data into records
const records: any = csv.parse(input, {
  delimiter: "|",
});
// Transform each value into uppercase
const uppercaseRecords: any = csv.transform(records, (record) => {
  return record.map((value: string) => {
    return value.toUpperCase();
  });
});
// Convert objects into a stream
const output: any = csv.stringify(uppercaseRecords, {
  cast: {
    string: (value: string, context: csv.stringifier.CastingContext) => {
      return context.index % 2 ? value.toLowerCase() : value.toUpperCase();
    },
  },
  quoted: true,
});
// Print the CSV stream to stdout
process.stdout.write(output);
